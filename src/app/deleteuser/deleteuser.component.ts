import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleteuser',
  templateUrl: './deleteuser.component.html',
  styleUrls: ['./deleteuser.component.css'],
})

/**
 * Deleting an existing user account is implemented in this class.
 * @author Burkart
 */
export class DeleteUserComponent implements OnInit {

  [x: string]: any;
  deleteFormGroup: FormGroup;
  loading = false;
  hide = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _alertService: AlertService,
    private _router: Router) { }

  ngOnInit() {
    this.deleteFormGroup = this._formBuilder.group({
      // Validators to check the length of the password
      pwdCtrl: [''],
    });
  }

  onSubmit() {
    // stop here if form is invalid
    if (this.deleteFormGroup.invalid) {
      return;
    }

    // deactivate the registration button
    this.loading = true;

    // call the method to request the delete
    this._authenticationService.deleteuser(this.pwdCtrl.value.toString())
      .then(() => {
        // if the delete was successful
        this._alertService.success('Ihr Account wurde erfolgreich gelöscht!');
        this._authenticationService.logout();
        this._router.navigate(['/login']); // route to login page
      })
      .catch( // catch the error-warnings if the method fails
        error => {
          this._alertService.error(error);
          this.loading = false;
        });
  }

  // getter for the password
  get pwdCtrl() { return this.deleteFormGroup.get('pwdCtrl'); }
}
