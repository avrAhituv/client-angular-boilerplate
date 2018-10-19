import { PaginationComponent } from './../pagination/pagination.component';
import { Papa } from 'ngx-papaparse';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../model/Notification';



@Component({
  selector: 'app-lists', 
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  constructor(private notify:NotificationService) { }
  
  ngOnInit() {
   
  }    

}
