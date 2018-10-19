import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  isIn = false;   // store state
  public userName: string
  public isAllowed: boolean = false

  constructor(private loginService: LoginService, private router: Router) {
    let user = localStorage.getItem('un')
    if (user) {
      this.userName = user
      this.isAllowed = true
    }
      
  }
  ngOnInit() {
  }

  toggleState() { 
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  logOff() {
    this.toggleState()
    this.loginService.logout()
    this.isAllowed = false
  }
  setting() {
    this.toggleState()
    this.router.navigate(['/settings'])
  }

}
