import { Inject, Injectable } from '@angular/core';
import axios, { TypedAxiosInstance } from 'restyped-axios';
import { Router, ActivatedRoute } from '@angular/router';

import { UserAPI } from '../user-api';
import { SumzAPI } from '../api/api';
import { HttpClient } from './http-client';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(HttpClient) private _apiClient: TypedAxiosInstance<SumzAPI>,
  ) { }

  // signin (is called in login.component)
  async login(email: string, password: string ) {
    const response = await this._apiClient.request({
      url: '/oauth/token',
      params: {email, password, 'grant_type' : 'password'},
      method: 'POST',
    });
    // if credentials correct, redirect to main page or return url
    if (response.status === 200) {
      // store user details in local storage to keep user logged in
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      // navigate to return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([this.returnUrl]);
    }
  }

  // get refresh token
  async refresh() {
    const response = await this._apiClient.request({
      url: '/oauth/token',
      params: {
        'refresh_token' : JSON.parse(localStorage.getItem('currentUser')).refresh_token,
        'grant_type' : 'refresh'},
      method: 'POST',
    });

    // delete old tokens
    this.logout();

    // if refresh token correct, redirect page
    if (response.status === 200) {
      // store new user details in local storage to keep user logged in
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      // navigate to return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([this.returnUrl]);
    }
  }

  // registration (is called in registration.component)
  async registration(email: string, password: string) {
    const response = await this._apiClient.request({
      url: '/users',
      data: {email, password},
      method: 'POST',
    });
    // if credentials correct, redirect to main page
    if (response.status === 200) {  // should be 302
      console.log('Registrierung klappt');
      // navigate to return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([this.returnUrl]);
    }
  }

    // changes the password (is called in changepassword.component)
    async changepassword(passwordold: string, passwordnew: string, passwordnew2: string) {
      const response = await this._apiClient.request({
        url: '/users/id',
        data: {passwordold, passwordnew, passwordnew2},
        method: 'PUT',
      });
      // if credentials correct, redirect to main page
      if (response.status === 200) {  // should be 302
        console.log('Reset klappt');
        // redirect to "successful registration"
        this.router.navigate(['/users']);
      }
    }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
