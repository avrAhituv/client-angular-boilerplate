import { Notification } from '../model/Notification';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  notifications: Notification[] = []

  add(mssg: Notification) {
    this.notifications.push(mssg)
    setTimeout(this.remove.bind(this, mssg), mssg.Duration);
  }

  remove(mssg: Notification) {
    this.notifications.splice(this.notifications.indexOf(mssg), 1)
  }

  constructor() { }

}
