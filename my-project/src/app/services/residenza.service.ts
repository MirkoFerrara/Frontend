import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Residenza } from '../models/residenza.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ResidenzaService {
  private baseUrl = `${environment.BACKEND_URL}/residenza`;

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