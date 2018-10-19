import { AuthGuard } from './services/auth.guard';
import { LoginService } from './services/login.service';
import { NotificationComponent } from './union/notification/notification.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './component/main-layout/main-layout.component';
import { LoginLayoutComponent } from './component/login-layout/login-layout.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { NotificationService } from './services/notification.service';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './component/settings/settings.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ListsComponent } from './component/lists/lists.component';
import { PaginationComponent } from './component/pagination/pagination.component';
import { PagerService } from './services/PagerService';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    LoginLayoutComponent,
    HomeComponent,
    LoginComponent,
    NotificationComponent,
    SettingsComponent,
    ListsComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,  
    ModalModule.forRoot()
  ],
  providers: [NotificationService,LoginService, AuthGuard,PagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
