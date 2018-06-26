import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ScenariosComponent, data: {state: 'scenarios'} },
  { path: 'login', component: LoginComponent, data: {state: 'login'} },
  { path: 'registration', component: RegistrationComponent, data: {state: 'registration'} },
  { path: 'create', component: CreateScenarioComponent, data: {state: 'create'} },
  { path: 'scenario/:id', component: ScenarioDetailComponent, data: {state: 'details'} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
