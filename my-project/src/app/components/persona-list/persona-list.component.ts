
import { Component, OnInit } from '@angular/core';
import { PersonaService } from '../../services/persona.service';
import { Persona } from '../../models/persona.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CodiceFiscaleService } from '../../services/coficefiscale.service';

// Custom Error State Matcher
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor(private component: PersonaListComponent) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && this.component.formSubmitted);
  }
}

@Component({
  selector: 'app-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.css']
})
export class PersonaListComponent implements OnInit {
  persone: Persona[] = [];
  newPersonaForm: FormGroup;
  displayedColumns: string[] = ['id', 'nome', 'cognome', 'dataNascita', 'codiceFiscale', 'azioni'];
  formSubmitted: boolean = false;
  customErrorStateMatcher: CustomErrorStateMatcher;

  constructor(
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder, 
    private codiceFiscaleService: CodiceFiscaleService
  ) {
    this.newPersonaForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      cognome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      dataNascita: ['', [Validators.required, this.dateValidator.bind(this)]], 
      codiceFiscale: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/)]]
    }, { validators: this.codiceFiscaleValidator.bind(this) });
    this.customErrorStateMatcher = new CustomErrorStateMatcher(this);
    this.newPersonaForm.get('dataNascita')?.valueChanges.subscribe(() => {
      this.newPersonaForm.get('dataNascita')?.updateValueAndValidity();
  });
  }
  
  ngOnInit(): void {
    this.loadPersone();
  }

  loadPersone(): void {
    this.personaService.list().subscribe(
      response => {
        if (response.responseCode) {
          this.persone = response.data;
        }
      },
      error => {
        this.showMessage('Errore nel caricamento delle persone');
      }
    );
  }
  
  createPersona(): void {
    if (this.newPersonaForm.valid) {
      const newPersona: Persona = this.newPersonaForm.value;
      
      if (newPersona.dataNascita instanceof Date) {
        newPersona.dataNascita = this.formatDate(newPersona.dataNascita);
      }

      this.personaService.create(newPersona).subscribe(
        response => {
          if (response.responseCode) {
            this.loadPersone();
            this.resetForm();
            this.showMessage('Persona creata con successo');
          } else {
            this.handleError('Errore nella creazione della persona: ' + response.msg);
          }
        },
        () => this.handleError('Errore nella creazione della persona')
      );
    } else {
      this.formSubmitted = true;
      this.newPersonaForm.get('dataNascita')?.updateValueAndValidity(); 
      this.showMessage('Per favore, compila tutti i campi richiesti.');
    }
  }
  private handleError(message: string): void {
    console.error(message);
    this.formSubmitted = false;  
    this.showMessage(message);
  } 
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  removePersona(id: number): void {
    this.personaService.remove(id).subscribe(
      response => {
        if (response.responseCode) {
          this.persone = this.persone.filter(persona => persona.id !== id);
          this.showMessage('Persona eliminata con successo');
        } else {
          this.showMessage('Errore nell\'eliminazione: ' + response.msg);
        }
      },
      error => {
        console.error('Errore nell\'eliminazione:', error);
        this.showMessage('Errore nell\'eliminazione della persona');
      }
    );
  }

  private initForm(): void {
    this.newPersonaForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      cognome: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      dataNascita: ['', [Validators.required, this.dateValidator.bind(this)]],
      codiceFiscale: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/)]]
    }, { validators: this.codiceFiscaleValidator.bind(this) });

    this.customErrorStateMatcher = new CustomErrorStateMatcher(this);

    // Add valueChanges subscriptions
    this.newPersonaForm.get('nome')?.valueChanges.subscribe(() => this.updateCodiceFiscaleValidation());
    this.newPersonaForm.get('cognome')?.valueChanges.subscribe(() => this.updateCodiceFiscaleValidation());
    this.newPersonaForm.get('dataNascita')?.valueChanges.subscribe(() => {
      this.newPersonaForm.get('dataNascita')?.updateValueAndValidity();
      this.updateCodiceFiscaleValidation();
    });
    this.newPersonaForm.get('codiceFiscale')?.valueChanges.subscribe(() => this.updateCodiceFiscaleValidation());
  }

  private resetForm(): void {
    this.formSubmitted = false;
    this.newPersonaForm.reset();
    this.initForm(); // Re-initialize the form
  }
  
  private updateCodiceFiscaleValidation(): void {
    this.newPersonaForm.get('codiceFiscale')?.updateValueAndValidity({ emitEvent: false });
    this.newPersonaForm.updateValueAndValidity({ emitEvent: false });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
    });
  }

  private dateValidator(control: FormControl): { [key: string]: any } | null {
    const inputDate = new Date(control.value);
    const currentDate = new Date();

    if (isNaN(inputDate.getTime())) {
        return { 'invalidDate': true };
    }
    if (inputDate > currentDate) {
        return { 'futureDate': true };
    }
    return null;  
  }


  private codiceFiscaleValidator(group: FormGroup): {[key: string]: any} | null {
    const nome = group.get('nome')?.value;
    const cognome = group.get('cognome')?.value;
    const dataNascita = group.get('dataNascita')?.value;
    const codiceFiscale = group.get('codiceFiscale')?.value;

    if (nome && cognome && dataNascita && codiceFiscale && !group.get('dataNascita')?.hasError('invalidDate')) {
      const dataNascitaObj = new Date(dataNascita);
      const calcolato = this.codiceFiscaleService.calcolaPrimiUndiciCaratteri(nome, cognome, dataNascitaObj);
      const cfDataNascita = this.codiceFiscaleService.estraiDataDaCodiceFiscale(codiceFiscale);
      
      if (calcolato !== codiceFiscale.substring(0, 11)) {
        return { 'codiceFiscaleInvalido': true };
      }
      
      if (cfDataNascita && !this.codiceFiscaleService.confrontaDate(cfDataNascita, dataNascitaObj)) {
        return { 'dataNascitaInvalida': true };
      }
    }
    return null;
  }
}