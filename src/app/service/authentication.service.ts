import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { Router, ActivatedRoute } from '@angular/router';

import { SumzAPI } from '../api/api';
import { HttpClient } from './http-client';
import { AlertService } from './alert.service';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    @Inject(HttpClient) private _apiClient: TypedAxiosInstance<SumzAPI>,
  ) {
    // handle expired access_token
    _apiClient.interceptors.response.use( response => {
      return response;
    }, error => {
      // debugger;
      if (error.response.status === 401 && localStorage.getItem('currentUser') && !error.response.config.headers._isRetry) {
        // get new access_token
        this.refresh()
        .then( () => {
          error.config.headers.Authorization = JSON.parse(localStorage.getItem('currentUser')).token_type
            + ' '
            + JSON.parse(localStorage.getItem('currentUser')).access_token;
          error.config.headers._isRetry = true;

          return _apiClient.request(error.config);
          // .then( (response) => {
          //   debugger;
          //   return Promise.resolve(response);
          // });
        })
        .catch( () => {
          console.log('Refresh login error: ', error);
          return Promise.reject(error);
        });
      }
    });

  }

  // signin (is called in login.component)
  async login(email: string, password: string ) {
    await this._apiClient.request({
      url: '/oauth/token',
      params: {email, password, 'grant_type' : 'password'},
      method: 'POST',
    }).then(response => {
      if (response.status === 200) {
        // store user details in local storage to keep user logged in
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        // navigate to return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([this.returnUrl]);
      }
    });
  }

  // get refresh token
  async refresh() {
    const response = await this._apiClient.request({
      url: '/oauth/token',
      params: {
        'refresh_token' : JSON.parse(localStorage.getItem('currentUser')).refresh_token,
        'grant_type' : 'refresh_token'},
      headers: { '_isRetry': true },
      method: 'POST',
    });

    // delete old tokens
    this.logout();

    // if refresh token correct, redirect page
    if (response.status === 200) {
      // store new user details in local storage to keep user logged in
      localStorage.setItem('currentUser', JSON.stringify(response.data));
    } else {
      return;
    }
  }

  // registration (is called in registration.component)
  async registration(email: string, password: string) {
    await this._apiClient.request({
      url: '/users',
      data: {email, password},
      method: 'POST',
    }).then(response => {
      // if credentials correct, redirect to main page
      if (response.status === 200) {  // should be 302
        console.log('Registrierung klappt');
        // navigate to return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([this.returnUrl]);
      }
    });
  }

    // changes the password (is called in changepassword.component)
    async changepassword(passwordold: string, passwordnew: string, passwordnew2: string) {
      await this._apiClient.request({
        url: '/users/id',
        data: {passwordold, passwordnew, passwordnew2},
        method: 'PUT',
      }).then( response => {
        // if credentials correct, redirect to main page
        if (response.status === 200) {  // should be 302
          console.log('Reset klappt');
          // redirect to "successful registration"
          this.router.navigate(['/users']);
        }
      });
    }

    // changes the password (is called in changepassword.component)
    async newpassword(passwordnew: string, passwordnew2: string) {
      const response = await this._apiClient.request({
        url: 'TODO nachdem die definiert haben',
        data: {passwordnew, passwordnew2},
        method: 'PUT',
      });
      // if credentials correct, redirect to main page
      if (response.status === 200) {
        this.router.navigate(['/users']);
      }
    }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
