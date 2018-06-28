import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationSuccessComponent} from './registration-success/registration-success.component';
import { AuthGuard } from './auth.guard';
import { ResetPasswordComponent} from './resetpassword/resetpassword.component';
import { ScenarioDetailComponent } from './scenario-detail/scenario-detail.component';
import { ScenariosComponent } from './scenarios/scenarios.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: ScenariosComponent, data: {state: 'scenarios'}, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, data: {state: 'login'} },
  { path: 'registration', component: RegistrationComponent, data: {state: 'registration'} },
  { path: 'registration-success', component: RegistrationSuccessComponent, data: {state: 'registration-success'} },
  { path: 'resetpassword', component: ResetPasswordComponent, data: {state: 'resetpassword'} },
  { path: 'create', component: CreateScenarioComponent, data: {state: 'create'}, canActivate: [AuthGuard] },
  { path: 'scenario/:id', component: ScenarioDetailComponent, data: {state: 'details'}, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
