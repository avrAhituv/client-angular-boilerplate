import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { PagerService } from '../../services/PagerService';
 
 
@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
 
export class PaginationComponent implements OnInit {
    constructor(private pagerService: PagerService) {
        
     }
 

    // array of all items to be paged
    @Input() allItems: any[];
    @Input() isRefersh:boolean = false   
    // @Input() show:boolean = false
    
    @Output()
    Paged:EventEmitter<any>= new EventEmitter<any>()
 
    // pager object
    pager: any = {};
    currentPage:number

    form:any={pageSize:15}
 
    // paged items
    pagedItems: any[];
 
    ngOnInit() { 
        // initialize to page 1
        this.setPage(1);
    }

    referesh(){
        if(this.pager.totalItems != this.allItems.length){
            this.isRefersh=true
            this.setPage(this.currentPage)
        }else{
            this.isRefersh=false
        }
    }   

    ngOnChanges() {
        this.setPage(this.currentPage)
      }
 
    setPage(page: number) {
        this.currentPage = page
        if(!this.allItems || !this.allItems.length)return
        // get pager object from service
        this.pager = this.pagerService.getPager(this.allItems.length, page, this.form.pageSize)
        // get current page of items
        this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1)      
        this.Paged.emit({items:this.pagedItems,pageMeta:this.pager})
        this.isRefersh=false
    }
    
    pageSize:Array<any> = [
    {id:5,name:'5'},
    {id:10,name:'10'},
    {id:15,name:'15'},
    {id:20,name:'20'},
    {id:25,name:'25'},
    {id:50,name:'50'},
    {id:75,name:'75'},   
    {id:100,name:'100'}
  ]

}

