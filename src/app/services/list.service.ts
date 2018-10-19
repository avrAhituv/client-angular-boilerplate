import { Router } from '@angular/router';
import { Injectable  } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { config } from '../config';

@Injectable()
export class ListService {
  
  // private productionUrl ='http://localhost:50999/api/projects'
  //private productionUrl ='http://papi.ahituv.net/api/projects'
  private devUrl ='http://localhost:59253/api' //Members
  private serverUrl ='https://api.sbmo.co.il/api'
  private listUrl =(config.isProd?this.serverUrl:this.devUrl) + '/Lists' // this.devUrl//  this.serverUrl// this.serverUrl //
  private memberUrl = (config.isProd?this.serverUrl:this.devUrl) +'/Members'
  private allLists:any[] = []
  private headers = new HttpHeaders({'Content-Type':'application/json'})
  private pagination:any

  constructor(private http: HttpClient, private router:Router) {
      this.setHeaders()
      this.get().subscribe(data => {
        this.pagination = data.paging
        this.allLists = data.items
      })
  }
  setHeaders(){
    let token = localStorage.getItem('tokenKey')
    if(!token) this.router.navigate(['/login'])
    this.headers = this.headers.set('Authorization','Bearer '+token)
  }
  get(): any{
    return this.http.get(this.listUrl+'/Get',{headers: this.headers})
  }

  getLists(): any[]{
      return this.allLists;;
  }

  getList(key: string,query:string=''): any{
    return this.http.get(this.memberUrl + '/Get?key='+ key+query, {headers: this.headers})    
  }
  remove(address:string):any{
    return this.http.delete(this.listUrl+'/delete',{params:{address:address},headers:this.headers})
  }

  addLists(nameUrl,name,description){    
    return this.http.post(this.listUrl+'/Create',{ NameUrl:nameUrl,Name:name, Description:description},{headers: this.headers})
    //return this.http.post(this.listUrl,body,{headers: this.headers})        
  }
  addMembers(listName,list,upsert){    
    return this.http.post(this.memberUrl+'/AddMembers',{ listKey:listName,list:list,upsert:upsert},{headers: this.headers})
    //return this.http.post(this.listUrl,body,{headers: this.headers})        
  }


}
