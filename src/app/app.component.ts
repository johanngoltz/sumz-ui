import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger, transition, query, style, animate, keyframes, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routerTransition', [
      transition('projects => details', [
        query(':enter', style({ position: 'fixed', opacity: 0 })
          , { optional: true }),
        query(':leave .subject', style({ position: 'fixed', opacity: 0 })
          , { optional: true }),
        group([
          query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' })),
          ], { optional: true }),
          query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' })),
          ], { optional: true }),
        ]),
      ]),
      transition('projects => create', [
        query(':enter', style({ position: 'fixed', opacity: 0, transform: 'translateY(25px)', zIndex: 7 })
          , { optional: true }),
        group([
          query(':leave mat-icon', [
            animate('.1s cubic-bezier(0.4, 0.0, 1, 1)',
              style({ opacity: 0 })),
          ], { optional: true }),
          query(':leave .fab-bottom-right', [
            style({ zIndex: 5 }),
            animate('.3s cubic-bezier(0.4, 0.0, 1, 1)',
              style({ transform: 'scale(5)', opacity: 0,
              backgroundColor: 'whitesmoke', boxShadow: 'none' })),
          ], { optional: true }),
          query(':leave h1, :leave mat-grid-list', animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', style({ opacity: 0 })) , { optional: true }),
        ]),
        query(':enter', [
          animate('.3s cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0px)' })),
          style({ position: 'static' }),
        ], { optional: true }),
        query(':leave', style({ position: 'fixed', opacity: 0 }) , { optional: true }),
      ]),
    ]),
  ],
})
export class AppComponent {
  log: NavigationEnd[];
  title = 'app';

  constructor(router: Router) {
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
}
