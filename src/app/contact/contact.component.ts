import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  constructor(private http: Http) { }

  async ngOnInit() {
    this.loadContacts();
  }
  async loadContacts() {
    const savedContacts = this.getItemsFromLocalStorage('contacts');
    if (savedContacts && savedContacts.length > 0) {
      this.contacts = savedContacts;
    } else {
      this.contacts = await this.LoadItemsFromFile();
    }
    this.sortById(this.contacts);
  }
  async LoadItemsFromFile() {
    const data = await this.http.get('assets/contacts.json').toPromise();
    // console.log('from LoadItemFromFile data: ', data.json());
    return data.json();
  }
  addContact() {
    this.contacts.unshift(new Contact({}));
  }
  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: Contact) {
    contact.editing = false;
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortById(contacts);
    const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    const savedContacts = JSON.parse(localStorage.getItem(key));
    return savedContacts;
  }

  searchContact(params: string) {
    this.contacts = this.contacts.filter((item: Contact, ) => {
      const fullName = item.firstName + ' ' + item.lastName;

      if (params === fullName || params === item.firstName || params === item.lastName) {
        return true;
      } else {
        return false;
      }
    });
  }

  sortById(contacts: Array<Contact>) {
    contacts.sort((prevContact: Contact, pressContact: Contact) => {
      return prevContact.id > pressContact.id ? 1 : -1;
    });
    return contacts;
  }
}
