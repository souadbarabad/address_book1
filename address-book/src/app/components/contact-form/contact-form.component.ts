import { Component } from '@angular/core';
import { AddressBookService } from '../../services/address-book.service';
import { ContactSyncService } from '../../services/contact-sync.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  contact = { name: '', address: '', phone: '' };

  constructor(
    private addressBookService: AddressBookService,
    private contactSyncService: ContactSyncService
  ) {}

  addContact(): void {
    this.addressBookService.addContact(this.contact).subscribe(() => {
      alert('Contact ajouté avec succès');
      this.contact = { name: '', address: '', phone: '' };
      this.contactSyncService.triggerRefreshContacts();
    });
  }

}
