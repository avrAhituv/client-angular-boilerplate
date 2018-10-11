import { Component, OnInit } from '@angular/core';
import { Notification } from '../../model/Notification';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(public NotifyService: NotificationService) { }

  ngOnInit() {
  }

}
