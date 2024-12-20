import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressBookService {
  private apiUrl = 'http://127.0.0.1:5000/contacts'; // URL de l'API Flask

  constructor(private http: HttpClient) {}

  // Obtenir tous les contacts
  getContacts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Ajouter un contact
  addContact(contact: any): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  // Rechercher un contact
  searchContactByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`);
  }
  
  updateContact(oldName: string, updatedContact: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${oldName}`, updatedContact);
  }
    

  // Supprimer un contact
  deleteContact(name: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${name}`);
  }
}
