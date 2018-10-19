import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { config } from './../config';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

@Injectable()
export class FilesService {
  private devUrl ='http://localhost:59253/api' //Members
  private serverUrl ='https://api.sbmo.co.il/api'
  private emailUrl =(config.isProd?this.serverUrl:this.devUrl) + '/Email' 
  
  private headers:HttpHeaders

  constructor(private http: HttpClient, private router:Router) {
      this.setHeaders()      
  }
  setHeaders(){
    let token = localStorage.getItem('tokenKey')
    if(!token) this.router.navigate(['/login'])
    this.headers = new HttpHeaders({'Authorization':'Bearer '+token})
  }

  upload(formData: FormData): Observable<HttpEvent<{}>> {
 
    const req = new HttpRequest('POST', this.emailUrl+'/PostFormData', formData, {
      reportProgress: true,
      responseType: 'text'
    });
 
    return this.http.request(req);
  }


}
