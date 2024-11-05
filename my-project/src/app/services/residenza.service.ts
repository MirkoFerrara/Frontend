import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Residenza } from '../models/residenza.model';

@Injectable({
  providedIn: 'root'
})
export class ResidenzaService {
  private baseUrl = 'http://localhost:8080/residenza';

  constructor(private http: HttpClient) {}

  create(residenza: Residenza): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, residenza);
  }

  list(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }
  
  remove(id: number): Observable<any>{
    return this.http.post(`${this.baseUrl}/remove?id=${id}`,{});
  }

  update(residenza: Residenza):Observable<any>{
    return this.http.post(`${this.baseUrl}/update`,residenza);
  }
}