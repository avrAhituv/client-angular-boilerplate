import { config } from '../config';
import { changePasswordModel } from '../model/ChangePassword';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../model/Notification';


@Injectable()
export class LoginService {
  private isProd: boolean = config.isProd
  devurl: string = '' 
  prodURL: string = ''
  url: string = this.isProd ? this.prodURL : this.devurl
  accountUrl: string = this.url+'/api/Account/'  

  _headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

  private loggedIn = new BehaviorSubject<boolean>(false); 

  get isLoggedIn() {
    let token= localStorage.getItem('tokenKey')
    let expires_in =localStorage.getItem('expires_in')
    if(token && expires_in){
      if(JSON.parse(expires_in) > Date.now() / 1000)
      this.loggedIn.next(true)
      return this.loggedIn.asObservable()
    }
    return this.loggedIn.asObservable()
  }

  constructor(private http: HttpClient, private notify: NotificationService,private router:Router) { }

  login(loginData: string, username) {   
    return this.http.post(this.url, loginData, { headers: this._headers }).subscribe(data => {
      let token:any = data     
      let now = new Date()
      let exp = now.setSeconds(token.expires_in)    
      localStorage.setItem('tokenKey', token.access_token)
      localStorage.setItem('expires_in', exp.toString())
      localStorage.setItem('un', username)  
      this.loggedIn.next(true)
      this.router.navigate(['/']) 
      },
      err =>{
        this.notify.add(new Notification('אירעה שגיאת רשת','שגיאה','danger')) 
      }
    )
  }

  logout() {    
    let token = localStorage.getItem('tokenKey')
    let headers = this._headers.set('Authorization', 'Bearer ' + token)
    this.http.post(this.accountUrl + 'Logout', {}, { headers: headers })
    localStorage.removeItem('tokenKey')
    localStorage.removeItem('expires_in')
    localStorage.removeItem('un')
    localStorage.clear()    
    this.loggedIn.next(false)
    this.router.navigate(['/login']);  
  }

  changePassword(passwordModel: changePasswordModel) {
    let token = localStorage.getItem('tokenKey')
    let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' })
    let headers = jsonHeader.set('Authorization', 'Bearer ' + token)
    return this.http.post(this.accountUrl + 'ChangePassword', { OldPassword: passwordModel.oldPassword, NewPassword: passwordModel.newPassword, ConfirmPassword: passwordModel.confirmPassword }, { headers: headers, responseType: 'text' })
  }

}
