import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactSyncService {
  private refreshContactsSource = new Subject<void>();
  refreshContacts$ = this.refreshContactsSource.asObservable();

  triggerRefreshContacts(): void {
    this.refreshContactsSource.next();
  }
}