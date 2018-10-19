import { FilesService } from './../../services/files.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ListService } from './../../services/list.service';
import { NotificationService } from './../../services/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Notification } from '../../model/Notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {  
  public csvRecords: any[] = [];
  public headers:any[] = []
  public form:any={groupName:''}
  public allLists:any[]=[]
  private lists = []
  public selectList:any[]=[]

  public mailForm:any ={}
  public selectedFiles:any  
  public progress: { percentage: number } = { percentage: 0 }
  public currentFileUpload:any
    
  constructor(private notify:NotificationService,
    private listService:ListService,private filesService:FilesService) { }

  

  ngOnInit() {    
    this.listService.get().subscribe(data => {
      if(data && data.items){
        this.lists  = data.items
        this.lists.forEach(l => {
          this.allLists.push(l)
          let name = l.name ? l.name : l.description
          this.selectList.push({id:l.address, name:name, desc:l.description })
        })
      }
    })
  }
  
 
  @ViewChild('file') file;

addFile(){
  this.file.nativeElement.click()
}

 selectFile(event) {
    this.selectedFiles = event.target.files
    //console.log(this.selectedFiles)
    if(this.selectedFiles[0].size > 2097152){ //2MB     
      this.notify.add(new Notification('נא לבחור קובץ בגודל של עד 2MB','הקובץ גדול מדי','danger',3000))
      this.file.nativeElement.value = ""
      this.selectedFiles = undefined
   }
  }

  public inSend = false
  sendMail(){
    if(this.inSend) return
    this.progress.percentage = 0
    let fileToUpload = this.selectedFiles.item(0)
    this.currentFileUpload = this.selectedFiles.item(0)
    if(!this.mailForm.group) return this.notify.add(new Notification('נא לבחור רשימת תפוצה!','','danger',3000))
    if(!this.mailForm.subject) return this.notify.add(new Notification('נא להזין נושא לדוא"ל.','','danger',3000))
    if(!this.mailForm.body){
      if(!confirm('האם ברצונך לשלוח את הדוא"ל בלא תוכן בגוף ההודעה?')) return
    }
    this.inSend=true
    let formData = new FormData()
    formData.append('file', fileToUpload, fileToUpload.name)
    formData.append('to',this.mailForm.group)
    formData.append('subject',this.mailForm.subject)
    formData.append('body',this.mailForm.body)
    formData.append('isHtml','false')

    this.filesService.upload(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total)
      } else if (event instanceof HttpResponse) {       
        this.selectedFiles = undefined
        this.currentFileUpload = undefined
        this.mailForm.subject=''
        this.mailForm.body = ''
        this.file.nativeElement.value = ""
        this.notify.add(new Notification('המייל נשלח בהצלחה'))
        this.inSend=false
      }
    })
  }

}
