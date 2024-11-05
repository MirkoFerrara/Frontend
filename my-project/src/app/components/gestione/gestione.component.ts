import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PersonaService } from '../../services/persona.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, map } from 'rxjs/operators';

interface Persona {
  nome: string;
  cognome: string;
  dataNascita: string;
  codiceFiscale: string;
  indirizzo: string;
  citta: string;
  cap: string;
}

@Component({
  selector: 'app-gestione',
  templateUrl: './gestione.component.html',
})
export class GestioneComponent implements OnInit, OnDestroy {
  searchAddress: string = '';
  personData: Persona[] = [];
  displayedColumns: string[] = ['nome', 'cognome', 'dataNascita', 'codiceFiscale', 'indirizzo', 'citta', 'cap'];
  errorMessage: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router, 
    private personaService: PersonaService
  ) { }
 
  ngOnInit() {
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.errorMessage = ''; 
        if (searchTerm.trim()) {
          return this.personaService.listByIndirizzo(searchTerm).pipe(
            map(response => ({
              data: response.data,
              searchTerm: searchTerm
            }))
          );
        } else {
          return [{ data: [], searchTerm: '' }];
        }
      })
    ).subscribe(
      ({ data, searchTerm }) => {
        this.personData = data;
        if (searchTerm.trim() && (!data || data.length === 0)) {
          this.errorMessage = 'Nessun risultato trovato per l\'indirizzo inserito';
        }
      },
      error => {
        console.error('Errore durante la ricerca:', error);
        this.errorMessage = 'Errore durante la ricerca. Per favore riprova.';
      }
    );
  }

  onSearchChange() {
    this.searchSubject.next(this.searchAddress);
  }

  goToPersone(): void {
    this.router.navigate(['/persone']);
  }

  goToResidenze(): void {
    this.router.navigate(['/residenze']);
  }
}