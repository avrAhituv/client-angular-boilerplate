import { PaginationComponent } from './../pagination/pagination.component';
import { Papa } from 'ngx-papaparse';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { ListService } from '../../services/list.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../model/Notification';



@Component({
  selector: 'app-lists', 
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  modalRef: BsModalRef
  public csvRecords: any[] = [];
  public fileHeaders:any[] = []
  public form:any={groupName:''}

  constructor(private papa: Papa,private listService:ListService,private modalService:BsModalService,private notify:NotificationService) { }
  public loading:boolean = false
  public allLists:any[]
  public selectList:any[]=[]
  public allMembers:any[]=[]
  public originalMembers:any[]=[]
  private selected:any
  public headers:any[] = [{key:'name',title:'שם'},{key:'address',title:'דוא"ל'},{key:'vars',title:'משתנים',renderer:function(obj){
    let result = ''
    Object.keys(obj).forEach(k=>{ result +=(k+' | ')})
    result = result.trim()
    return result.substr(0,result.length-1)
  }}]
  // private timeout:any
  ngOnInit() {
    this.getLists()
    // this.timeout = setInterval(() => {
    //   this.referesh()
    // }, 1000);
  }
  // ngOnDestroy(){
  //   clearInterval(this.timeout)
  // }
  @ViewChild(PaginationComponent) pagination:PaginationComponent
  referesh(){
    if(!this.totalItems) return
    if(this.totalItems != this.allMembers.length){
      this.isDataChange=true     
      this.pagination.referesh()
    }else{
      this.isDataChange=false
    }
  }

  getLists(){
    this.listService.get().subscribe(data => {
      if(data && data.items){
        this.allLists  = data.items
        this.allLists.forEach(l => {          
          let name = l.name ? l.name : l.description
          this.selectList.push({id:l.address, name:name, desc:l.description,num:l.members_count })
        })
      }
    })
  }
  public searchVal:string=''
  search(){
    if(!this.originalMembers || !this.originalMembers.length) return
    this.allMembers = this.originalMembers.filter(member=>{
      return member.address.includes(this.searchVal) || member.name.includes(this.searchVal)
    })
    this.isDataChange=true
    this.pagination.referesh()
  }
  public totalItems:number
  public pageData:Array<any> = new Array<any>()
  public isDataChange:boolean = false
  // public startIndex:number

  onPagination(event:any){   
    this.pageData = event.items
    this.totalItems = event.pageMeta.totalItems    
  }
  

  selectedList(item:any){
    this.selected=item
    this.allMembers.length=0    
    this.loading=true
      this.listService.getList(item.address).subscribe(data =>{        
        if(data.items && data.items.length){
          this.allMembers=data.items
          this.originalMembers = data.items.slice()
          this.loading=false
        }
      },err=>{
        this.loading=false
        this.onEror(err,'אירעה שגיאה בעת ביצוע בקשתך. נא לנסות מאוחר יותר, תודה.')
      })       
  }
  public contentSize = 1000
  //public nextSize = 1000
  loadAllMembers(){
    let size = 1000
    let last = this.allMembers[this.allMembers.length-1].address
    this.contentSize+=size
    //this.nextSize = Math.min(this.contentSize,this.selected.members_count)
    this.listService.getList(this.selected.address,'&last='+last).subscribe(data =>{
      // console.log(data)
      if(data.items && data.items.length){
        this.allMembers.push.apply(this.allMembers,data.items)
        this.originalMembers = this.allMembers.slice()
        this.pagination.referesh()
      }
    },err=>{
      this.onEror(err,'אירעה שגיאה בעת ביצוע בקשתך. נא לנסות מאוחר יותר, תודה.')
    })  
  }


  removeList(event,item:any){
    if(!confirm('האם ברצונך למחוק רשימה זו? פעולה זו הינה בלתי הפיכה!')) return
    event.stopPropagation()
    this.listService.remove(item.address)
      .subscribe(arg => {
        this.notify.add(new Notification('הרשימה נמחקה בהצלחה.'))
        this.getLists()
      },err=>{
        this.onEror(err,'אירעה שגיאה בעת ביצוע בקשתך. נא לנסות מאוחר יותר, תודה.')
      })
    
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
  openModal2(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  import(){
    if(!this.csvRecords.length) return  this.notify.add(new Notification('נא לבחור קובץ!','','danger',3000))
    if(!this.form.groupName.length) return  this.notify.add(new Notification('נא להזין שם לרשימת התפוצה!','','danger',3000))
    if(!this.form.nameUrl.length) return  this.notify.add(new Notification('נא להזין כתובת באנגלית לרשימת התפוצה!','','danger',3000))
    
    this.listService.addLists(this.form.nameUrl,this.form.groupName,this.form.description).subscribe((res)=>{
      // console.log(res)
      this.notify.add(new Notification('הרשימה נוצרה בהצלחה בהצלחה'))      
      let items = this.getListItemsFromFile()
      this.listService.addMembers(this.form.nameUrl,items,"no").subscribe((res)=>{
        // console.log(res)
        this.allLists.push({address:this.form.nameUrl,name:this.form.groupName, desc: this.form.description })
        this.selectList.push({id:this.form.nameUrl,name:this.form.groupName, desc: this.form.description })
        this.notify.add(new Notification('רשימת התפוצה יובאה בהצלחה.'))
        this.modalRef.hide()
       this.formReset()
        this.getLists()
      },err=>{
        this.onEror(err,'אירעה שגיאה בעת שמירת תוכן הקובץ. נא לנסות מאוחר יותר, תודה.')
      })
      
    },err=>{
      this.onEror(err,'אירעה שגיאה בעת יצירת הרשימה, נא לנסות מאוחר יותר, תודה.')
    })
    
  }
public updateForm:any = {}
  updateList(){
    if(!this.csvRecords.length) return  this.notify.add(new Notification('נא לבחור קובץ!','','danger',3000))
    if(!this.updateForm.group.length) return  this.notify.add(new Notification('נא לבחור רשימה!','','danger',3000))
    let items = this.getListItemsFromFile()
    let startUrl = this.updateForm.group.substr(0,this.updateForm.group.indexOf('@'))
    this.listService.addMembers(startUrl,items,"yes").subscribe((res)=>{        
      this.notify.add(new Notification('רשימת התפוצה עודכנה בהצלחה.'))
      this.modalRef.hide()
      this.updateForm.group = ''
      this.csvRecords.length = 0
    },err=>{
      this.onEror(err,'אירעה שגיאה בעת שמירת תוכן הקובץ. נא לנסות מאוחר יותר, תודה.')     
    })
  }
  getListItemsFromFile(){
    let items = []
      this.csvRecords.forEach(e => {
        let temp:any = {}
        temp.firstName = e[0]
        temp.lastName = e[1]
        temp.email = e[2]
        temp.vars = JSON.stringify({first:e[0],last:e[1]})
        items.push(temp)
      })
      //test 2000 contacts
      // for (let index = 0; index < 1010; index++) {
      //   let t:any = {}
      //   t.firstName = 'אברהם-'+index
      //   t.lastName = 'אחיטוב-'+index
      //   t.email ='abcd'+index+'.atahituv@gmail.com'
      //   t.vars = JSON.stringify({first:t.firstName,last: t.lastName })
      //   items.push(t)
      // }
      return items
  }
  isCSVFile(file: any) {
    return file.name.endsWith('.csv')
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = ""
    this.csvRecords = []
  }
  updateCsvData(results){
    this.fileHeaders = results.data[0]
    this.csvRecords = results.data.slice()
    this.csvRecords.shift()
    let last =this.csvRecords[this.csvRecords.length-1]
    if(last.length ==1 && !last[0].length)
      this.csvRecords.pop()
  }
  formReset(){
    this.csvRecords.length=0
    this.form.groupName=''
    this.form.nameUrl=''
    this.form.description = ''
  }
  onEror(err,message){
    if(err.error.Message){
      let mssg = err.error.Message
      this.notify.add(new Notification(mssg,'שגיאה','danger',4000))
    }
      else this.notify.add(new Notification(message,'שגיאה','danger',4000))
 
  }
}
