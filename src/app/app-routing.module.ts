import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: {state: 'login'} },
  { path: 'registration', component: RegistrationComponent, data: {state: 'registration'} },
  { path: 'scenario/:id', component: ScenarioDetailComponent, data: {state: 'details'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
