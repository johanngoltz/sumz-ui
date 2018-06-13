import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  // standard set of CRUD methods for managing users
  // acts as the interface between Angular application and backend
  // Todo: URLs need to be configured
  getAll() {
      return this.http.get<User[]>('/backend/users');
  }

  getById(id: number) {
      return this.http.get('/backend/users/' + id);
  }

  create(user: User) {
      return this.http.post('/backend/users', user);
  }

  update(user: User) {
      return this.http.put('/backend/users/' + user.id, user);
  }

  delete(id: number) {
      return this.http.delete('/backend/users/' + id);
  }
}
