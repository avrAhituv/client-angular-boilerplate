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
  private isProd: boolean = config.isProd//false//true//
  devurl: string = 'http://localhost:59253/token' 
  prodURL: string = 'https://api.sbmo.co.il/token'

  accountUrlDev: string = 'http://localhost:59253/api/Account/'
  accounUrlProd: string = 'https://api.sbmo.co.il/api/Account/'
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
    let url = this.isProd ? this.prodURL : this.devurl
    return this.http.post(url, loginData, { headers: this._headers }).subscribe(data => {
      let token:any = data
      // console.log(token)
      let now = new Date()
      let exp = now.setSeconds(token.expires_in)
      // console.log(exp)
      // console.log(new Date(exp))
      localStorage.setItem('tokenKey', token.access_token)
      localStorage.setItem('expires_in', exp.toString())
      localStorage.setItem('un', username)  
      this.loggedIn.next(true)
      this.router.navigate(['/']) 
      },
      err =>{
        this.notify.add(new Notification('אירעה שגיאת רשת','שגיאה','danger'))        
        console.log(err)
      }
    )
  }

  logout() {
    let url = this.isProd ? this.accounUrlProd : this.accountUrlDev
    let token = localStorage.getItem('tokenKey')
    let headers = this._headers.set('Authorization', 'Bearer ' + token)
    this.http.post(url + 'Logout', {}, { headers: headers })
    localStorage.removeItem('tokenKey')
    localStorage.removeItem('expires_in')
    localStorage.removeItem('un')
    localStorage.clear()    
    this.loggedIn.next(false)
    this.router.navigate(['/login']);  
  }

  changePassword(passwordModel: changePasswordModel) {
    let url = this.isProd ? this.accounUrlProd : this.accountUrlDev
    let token = localStorage.getItem('tokenKey')
    let jsonHeader = new HttpHeaders({ 'Content-Type': 'application/json' })
    let headers = jsonHeader.set('Authorization', 'Bearer ' + token)
    return this.http.post(url + 'ChangePassword', { OldPassword: passwordModel.oldPassword, NewPassword: passwordModel.newPassword, ConfirmPassword: passwordModel.confirmPassword }, { headers: headers, responseType: 'text' })
  }

}
