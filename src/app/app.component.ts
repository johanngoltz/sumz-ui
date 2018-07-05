import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { AuthenticationService } from './service/authentication.service';
import { MatDialog } from '@angular/material';
import { ImportScenarioComponent } from './import-scenario/import-scenario.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routerTransition', [
      transition('scenarios => create', [
        query(':enter', style({ position: 'fixed', opacity: 0, transform: 'translateY(25px)', zIndex: 7 })
          , { optional: true }),
        group([
          query(':leave mat-icon', [
            animate('.1s cubic-bezier(0.4, 0.0, 1, 1)',
              style({ opacity: 0 })),
          ], { optional: true }),
          query(':leave .fab-bottom-right, :enter #spinner', [
            style({ zIndex: 5 }),
            animate('.3s cubic-bezier(0.4, 0.0, 1, 1)',
              style({
                transform: 'scale(5)', opacity: 0,
                backgroundColor: 'whitesmoke', boxShadow: 'none',
              })),
          ], { optional: true }),
          query(':leave h1, :leave h1+div, :leave mat-grid-list',
            animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })), { optional: true }),
        ]),
        query(':enter', [
          animate('.3s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px)' })),
          style({ position: 'static' }),
        ], { optional: true }),
        query(':leave', style({ position: 'fixed', opacity: 0 }), { optional: true }),
      ]),
      transition('* => *', [
        query(':enter', style({ position: 'fixed', opacity: 0, zIndex: 7 })
          , { optional: true }),
        query(':enter .content-container', style({ transform: 'translateY(25px)' })
          , { optional: true }),
        query(':enter .fab-bottom-right, :enter #spinner', style({ transform: 'scale(0)' })
          , { optional: true }),
        query(':leave ', [
          animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })),
        ], { optional: true }),
        group([
          query(':enter', animate('.3s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1 })), { optional: true }),
          query(':enter .content-container', animate('.3s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ transform: 'translateY(0px)' }))
            , { optional: true }),
        ]),
        query(':leave ', style({ position: 'fixed' }), { optional: true }),
        query(':enter ', style({ position: 'static' }), { optional: true }),
        query(':enter .fab-bottom-right', [
          animate('.3s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ transform: 'scale(1)' })),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class AppComponent {
  log: NavigationEnd[];
  title = 'SUMZ';

  constructor(
    router: Router,
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _dialog: MatDialog,
  ) {
    this.log = [];
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((route: NavigationEnd) => {
      this.log.push(route);
    });
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }

  openImportDialog() {
    this._dialog.open(ImportScenarioComponent).afterClosed().subscribe();
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigateByUrl('/login');
  }

  change() {
    this._router.navigateByUrl('changepassword');
  }
}
