import { Component, OnInit } from '@angular/core';
import { AddressBookService } from '../../services/address-book.service';
import { ContactSyncService } from '../../services/contact-sync.service';



@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  contacts: any[] = [];
  searchQuery: string = '';
  isEditModalOpen: boolean = false;
  selectedContact: any = {};  // Initialisation de selectedContact



  constructor(private addressBookService: AddressBookService,
    private contactSyncService: ContactSyncService

  ) {}

  ngOnInit(): void {
    this.loadContacts();
     // Abonne-toi au service pour recharger les contacts
     this.contactSyncService.refreshContacts$.subscribe(() => {
      this.loadContacts();
    });
  }

  loadContacts(): void {
    this.addressBookService.getContacts().subscribe(data => {
      this.contacts = data;
    });
  }

  updateContact(): void {
    if (!this.selectedContact.name) {
      alert("Le nom du contact est nécessaire");
      return;
    }
    this.addressBookService.updateContact(this.selectedContact.name, this.selectedContact).subscribe(() => {
      alert('Contact mis à jour avec succès');
      this.loadContacts();
      this.closeEditModal();
    }, (error) => {
      console.error("Erreur lors de la mise à jour:", error);
      alert('Erreur lors de la mise à jour du contact');
    });
  }
  
  
  deleteContact(name: string): void {
    this.addressBookService.deleteContact(name).subscribe(() => {
      this.loadContacts(); // Recharge la liste après suppression
    });
  }
  searchContacts(): void {
    if (this.searchQuery.trim() === '') {
      this.loadContacts(); // Recharge tous les contacts si le champ est vide
    } else {
      this.addressBookService.searchContactByName(this.searchQuery).subscribe(
        data => {
          console.log('Contact trouvé:', data);  // Log pour vérifier la réponse
          this.contacts = [data]; // Remplace les contacts par le résultat de la recherche
        },
        error => {
          alert('Contact non trouvé');
          this.contacts = []; // Vide la liste si aucun contact n'est trouvé
        }
      );
    }
  }

  selectContact(contact: any): void {
    this.selectedContact = { ...contact };  // Création d'une copie du contact sélectionné
  }
  openEditModal(contact: any): void {
    this.selectedContact = { ...contact }; // Copie du contact à modifier
    this.isEditModalOpen = true; // Ouvre la modale
  }

  closeEditModal(): void {
    this.isEditModalOpen = false; // Ferme la modale
  }
}
