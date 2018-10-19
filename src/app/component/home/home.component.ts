import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Notification } from '../../model/Notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {  
 
    
  constructor(private notify:NotificationService ) { }

  

  ngOnInit() {    
  this.notify.add(new Notification('Wellcome to angular-boilerplate!!','Heading Notification','info',7000))
  this.notify.add(new Notification('angular-boilerplate clone and serve successfull!!','success Notification','success',7000))
  }
 

}
