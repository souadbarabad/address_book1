import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactListComponent } from './components/contact-list/contact-list.component';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms'; // Importer FormsModule


@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent,
    ContactListComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
