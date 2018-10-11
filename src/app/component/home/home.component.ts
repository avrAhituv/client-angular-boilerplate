import { NotificationService } from './../../services/notification.service';
import { CSVRecord } from './../../model/CsvRecord';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Notification } from '../../model/Notification';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  modalRef: BsModalRef
  public csvRecords: any[] = [];
  public headers:any[] = []
  public form:any={groupName:''}
  public allLists:any[]=[]
  private lists = {}
  public selectList:any[]=[]
    
  constructor(private papa: Papa,private notify:NotificationService,private modalService:BsModalService) { }

  updateCsvData(results){
    this.headers = results.data[0]
    this.csvRecords = results.data.slice()
    this.csvRecords.shift()
    let last =this.csvRecords[this.csvRecords.length-1]
    if(last.length ==1 && !last[0].length)
      this.csvRecords.pop()
  }

  ngOnInit() {
    let storage = localStorage.getItem('lists')
    if(!storage) return
    this.lists  = JSON.parse(storage)
    if(this.lists && Object.keys(this.lists).length){
      Object.keys(this.lists).forEach((key,idx)=>{
        this.allLists.push({key:this.lists[key]})
        this.selectList.push({id:key,name:key})
      })
    }
  }
  @ViewChild('fileImportInput') fileImportInput: any;

  fileChangeListener($event: any): void {
    var text = [];
    var files = $event.srcElement.files
    if(!files || !files.length) return
    
    if (this.isCSVFile(files[0])) {
    
    var input = $event.target;
 
    this.papa.parse(input.files[0], {
      complete:(result)=>{
        setTimeout(this.updateCsvData.bind(this,result),1)
      }
    })
   
    } else {
    alert('אנא בחר בקובץ CSV חוקי.');
    this.fileReset();
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  import(){
    if(!this.csvRecords.length) return  this.notify.add(new Notification('נא לבחור קובץ!','','danger',3000))
    if(!this.form.groupName.length) return  this.notify.add(new Notification('נא להזין שם לרשימת התפוצה!','','danger',3000))
    this.lists[this.form.groupName]=this.csvRecords
    localStorage.setItem('lists',JSON.stringify(this.lists))
    let item = {}
    item[this.form.groupName]=this.csvRecords
    this.allLists.push(item)
    this.selectList.push({id:this.form.groupName,name:this.form.groupName})
    this.notify.add(new Notification('הרשימה נשמרה בהצלחה'))
    this.modalRef.hide()
    this.csvRecords.length=0
    this.form.groupName=''
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv')
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
  }

}
