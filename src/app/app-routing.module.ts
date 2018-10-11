import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './component/login/login.component';
import { HomeComponent } from './component/home/home.component';
import { LoginLayoutComponent } from './component/login-layout/login-layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './component/main-layout/main-layout.component';
import { SettingsComponent } from './component/settings/settings.component';

const appRoutes: Routes = [
  {path: '',                      
  component: MainLayoutComponent,
  canActivate: [AuthGuard],     
  children: [
    {
      path: '',
      component: HomeComponent  
    },
    { path: 'home', component: HomeComponent },
    { path: 'lists', component: HomeComponent },
    { path: 'settings', component: SettingsComponent }  
  ]},
  {
    path: '',
    component: LoginLayoutComponent, 
    children: [
      {
        path: 'login',
        component: LoginComponent   // {5}
  }]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
