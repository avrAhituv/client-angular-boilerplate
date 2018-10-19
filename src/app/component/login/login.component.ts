import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../model/Notification';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService:LoginService, private router:Router,
  private notify:NotificationService) { }
  isLoading:boolean = false

  public wHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight

  username:string
  password:string

  ngOnInit() {
  }
  login(){
    this.isLoading = true
    let loginData = 'grant_type=password&username='+ this.username +
      '&password='+ this.password   
    let isLogin = this.loginService.login(loginData, this.username)
   
  }
 

}
