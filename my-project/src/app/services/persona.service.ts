import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../models/persona.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private baseUrl = `${environment.BACKEND_URL}/persona`;

  constructor(private http: HttpClient) { }

  create(persona: Persona): Observable<any> {
    if (persona.dataNascita && typeof persona.dataNascita === 'string') {
      const dateParts = persona.dataNascita.split('-'); // Converti da yyyy-MM-dd
      if (dateParts.length === 3) {
        // Converti al formato dd/MM/yyyy
        persona.dataNascita = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
      }
    } else {
      console.error('dataNascita non è una stringa:', persona.dataNascita);
      // Puoi decidere di lanciare un errore o gestire la situazione in altro modo
    }
    return this.http.post(`${this.baseUrl}/create`, persona);
  }

  list(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getById?id=${id}`, {});
  }

  remove(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/remove?id=${id}`, {});
  }

  update(persona: Persona): Observable<any> {
    return this.http.post(`${this.baseUrl}/update`, persona);
  }

  listByIndirizzo(indirizzo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/listByIndirizzo?indirizzo=${encodeURIComponent(indirizzo)}`);
  } 

  listNoResidenza(): Observable<any> {
    return this.http.get(`${this.baseUrl}/listNoResidenza`);
}
  
}