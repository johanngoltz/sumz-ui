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
  submitted = false;
  hide_pw1 = true;

  constructor(
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService, private router: Router) { }

  ngOnInit() {
    this.deleteFormGroup = this._formBuilder.group({
      // Validators to check the length of the password
      pwdCtrl: ['', Validators.minLength(8)],
    });
  }

  onSubmit() {
    // deactivate the registration button
    this.submitted = true;

    // stop here if form is invalid
    if (this.deleteFormGroup.invalid) {
      return;
    }

    // call the method to request the delete
    this.authenticationService.deleteuser(this.pwdCtrl.value.toString())
      .then(() => {
        // if the delete was successful
        this.alertService.success('Ihr Account wurde erfolgreich gelöscht!');
        this.authenticationService.logout();
        this.router.navigate(['/login']); // route to login page
      })
      .catch( // catch the error-warnings if the method fails
        error => {
          this.alertService.error(error);
          this.submitted = false;
        });
  }

  // getter for the password
  get pwdCtrl() { return this.deleteFormGroup.get('pwdCtrl'); }
}
