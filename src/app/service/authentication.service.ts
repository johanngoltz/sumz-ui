import { Inject, Injectable } from '@angular/core';
import { TypedAxiosInstance } from 'restyped-axios';
import { Router, ActivatedRoute } from '@angular/router';

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
  ) {
    // handle expired access_token
    this.addInterceptor();
  }

  /**
   * signin a registered user
   * @param {string} email Email of the user
   * @param {string} password Password of the user
   * @returns {Promise} Promise
   */
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

  /**
   * refresh the tokens for authenticated server communicaiton
   * @returns {Promise} Promise
   */
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
      return;
    } else {
      return;
    }
  }

  /**
   * register a new user
   * (is called in registration.component)
   * @param {string} email Email
   * @param {string} password Password
   * @returns {Promise} Promise
   */
  async register(email: string, password: string) {
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

  /**
   * changes the password
   * (is called in changepassword.component)
   * @param {string} passwordold Actual password
   * @param {string} passwordnew new password
   * @param {string} passwordnew2 new password
   * @returns {Promise} Promise
   */
  async changePassword(passwordold: string, passwordnew: string, passwordnew2: string) {
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

  /**
   * send a request to reset the current password
   * (is called in newpassword.component)
   * @param {string} email email
   * @returns {Promise} Promise
   */
  async resetPassword(email: string) {
    await this._apiClient.request({
      url: '/users/forgot',
      data: {email},
      method: 'POST',
    });
  }

  /**
   * sends the new password after the reset
   * @param {string} password new passwoed
   * @returns {Promise} Promise
   */
  async postNewPassword(password: string) {
    await this._apiClient.request({
      url: '/users/reset/token',
      data: {password},
      method: 'POST',
    });
  }


  /**
   * removes user from local storage to log user out
   * @returns {void}
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  /**
   * Intercepts a response and refreshes access_token.
   * Afterwards, the http-request is executed with the new access_token.
   * @returns {void}
   */
  private addInterceptor() {
    this._apiClient.interceptors.response.use( response => {
      return response;
    },
    error => {
      if (error.response.status === 401 && localStorage.getItem('currentUser') && !error.response.config.headers._isRetry) {
        // get new access_token
        return this.refresh()
        .then( () => {
          error.config.headers.Authorization = JSON.parse(localStorage.getItem('currentUser')).token_type
            + ' '
            + JSON.parse(localStorage.getItem('currentUser')).access_token;

          error.config.headers._isRetry = true;

          // return the response with a new access_token
          return this._apiClient.request(error.config);
        })
        .catch( () => {
          console.log('Refresh login error: ', error);
          return Promise.reject(error);
        });
      }
    });
  }
}
