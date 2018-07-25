import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable() 
export class AppService {
    
    url = 'http://localhost:3000/data';

    constructor(private http: HttpClient ) { }
    
    getData(id: string) {
        return this.http.get(this.url + '?id='+id);
    }
} 
