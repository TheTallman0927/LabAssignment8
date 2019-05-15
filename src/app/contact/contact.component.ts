import { Component, OnInit } from '@angular/core';
import { Contact } from './contact.model';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../login/login.component';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contacts: Array<Contact> = [];
  contactParams: '';
  LocalStorageService: LocalStorageService<Contact>;
  currentUser: IUser;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService) {
    this.LocalStorageService = new LocalStorageService('contacts');
  }

  async ngOnInit() {
    const currentUser = this.LocalStorageService.getItemsFromLocalStorage('user');
    if (currentUser == null) {
      // this.router.navigate(['login']);
    }
    this.loadContacts();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login componet to this component', data);
      this.currentUser = data;
    });
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
    this.contacts.unshift(new Contact({
      id: null,
      firstName: null,
      lastName: null,
      phone: null,
      email: null
    }));
  }
  deleteContact(index: number) {
    this.contacts.splice(index, 1);
    this.saveItemsToLocalStorage(this.contacts);
  }

  saveContact(contact: Contact) {

    let hasError = false;
    Object.keys(contact).forEach((key: any) => {
      if (contact[key] == null) {
        hasError = true;
        this.toastService.showToast('danger', 2000, 'Saved failed! property ${key} must not be null');
      }
    });
    if (!hasError) {
      contact.editing = false;
      this.saveItemsToLocalStorage(this.contacts);
    }
  }

  saveItemsToLocalStorage(contacts: Array<Contact>) {
    contacts = this.sortById(contacts);
    return this.LocalStorageService.saveItemsToLocalStorage(contacts);
    // const savedContacts = localStorage.setItem('contacts', JSON.stringify(contacts));
    // return savedContacts;
  }

  getItemsFromLocalStorage(key: string) {
    // const savedContacts = JSON.parse(localStorage.getItem(key));
    return this.LocalStorageService.getItemsFromLocalStorage();
    // return savedContacts;
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
  Logout() {
    // clear localStorage
    this.LocalStorageService.clearItemFromLocalStorage();
    // navigate to login page
    this.router.navigate(['']);

  }
}
