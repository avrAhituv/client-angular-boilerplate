import { AuthGuard } from './services/auth.guard';
import { LoginService } from './services/login.service';
import { NotificationComponent } from './union/notification/notification.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import {PapaParseModule} from 'ngx-papaparse';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './component/main-layout/main-layout.component';
import { LoginLayoutComponent } from './component/login-layout/login-layout.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NotificationService } from './services/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './component/settings/settings.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { from } from 'rxjs/observable/from';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    LoginLayoutComponent,
    HomeComponent,
    LoginComponent,
    NotificationComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    PapaParseModule,
    ModalModule.forRoot()
  ],
  providers: [NotificationService,LoginService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
