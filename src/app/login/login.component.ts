import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../localStorageService';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IUser {
  id?: number;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: IUser = { username: '', password: '' };
  localStorageService: LocalStorageService<IUser>;
  currentUser: IUser = null;
  constructor(private router: Router, private toastServcie: ToastService) {
    this.localStorageService = new LocalStorageService('user');
  }

  ngOnInit() {
    this.currentUser = this.localStorageService.getItemsFromLocalStorage();
    console.log('thiscurrentUser.....' , this.currentUser);
    if (this.currentUser != null) {
      // this.router.navigate(['contacts']);
    }
  }
  Login(user: IUser) {
    console.log('from login user: ', user);
    const defaultUser: IUser = { username: 'James', password: 'James1' };
    if (user.username !== '' && user.password !== '') {
      if (user.username === defaultUser.username && user.password === defaultUser.password) {
        // log the user in
        // store user in LocalStorage
        this.localStorageService.saveItemsToLocalStorage(user);
        // navigate to contacts page
        this.router.navigate(['contacts', user]);
      } else {
        // show error toast user
        console.log('from else..........');
        this.toastServcie.showToast('danger', 15000, 'Login Failed! Please check your Username or Password ');
      }
    } else {
      // show error toast user
      this.toastServcie.showToast('danger', 15000 , 'Login Failed! Please Specify user and password! ');
    }
  }

}
