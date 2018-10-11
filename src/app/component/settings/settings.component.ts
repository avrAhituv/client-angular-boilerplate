import { changePasswordModel } from '../../model/ChangePassword';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Notification } from '../../model/Notification';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal'
import { LoginService } from '../../services/login.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  modalRef: BsModalRef
  constructor(private notifyService:NotificationService,private loginSer:LoginService,private modalService: BsModalService) { }
  private changePassword:changePasswordModel = new changePasswordModel()

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  changePass(){
    if(!this.validate()) return
    this.loginSer.changePassword(this.changePassword).subscribe(()=>{     
      this.modalRef.hide()
      this.notifyService.add(new Notification('הסיסמה שונתה בהצלחה!'))
    },err=>{
      return this.notifyService.add(new Notification('אירעה שגיאה, אנא נסה שנית',null,'danger'))      
    })

  }
  validate(){
    if(!this.changePassword.oldPassword || !this.changePassword.newPassword || !this.changePassword.confirmPassword){
      this.notifyService.add(new Notification('נא להזין נתונים בטופס!',null,'danger'))
      return false
    }
    if(!this.validatePass(this.changePassword.newPassword)){
      this.notifyService.add(new Notification('הסיסמה אינה חוקית! הסיסמא חייבת להיות באורך של 6 תוים לפחות',null,'danger'))
      return false
    }       
    if(!this.confirmPass(this.changePassword.newPassword,this.changePassword.confirmPassword)){
      this.notifyService.add(new Notification('הסיסמאות אינם תואמות',null,'danger'))
      return false
    }
    return true       
  }
  validatePass(pass:string){
    if(pass.length < 6)
      return false    
    return true
  }
  confirmPass(pass:string, confirm:string){
    if(pass == confirm) return true
    return false
  }

}
