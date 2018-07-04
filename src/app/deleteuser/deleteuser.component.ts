import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

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
      private alertService: AlertService) {}

    ngOnInit() {
      this.deleteFormGroup = this._formBuilder.group({
        // Validators to check the length of the password
        pwd: ['', Validators.minLength(8)],
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
      this.authenticationService.deleteuser(this.pwd.value.toString())
        .catch( // catch the error-warnings if the method fails
          error => {
            this.alertService.error(error);
            this.loading = false;
          });

      // if deleting was successful
      this.alertService.success('Ihr Account wurde erfolgreich gelöscht!');
    }

    // getter for the password
    get pwd() { return this.deleteFormGroup.get('pwd'); }
}
