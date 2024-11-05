import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ResidenzaService } from '../../services/residenza.service';
import { PersonaService } from '../../services/persona.service';
import { Residenza } from '../../models/residenza.model';
import { Persona } from '../../models/persona.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ResidenzaEditDialogComponent } from '../residenza-edit-dialog/residenza-edit-dialog.component';
import { StateService } from '../../services/state.service';

// Updated CustomErrorStateMatcher
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor(private component: ResidenzaListComponent) {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.invalid && this.component.formSubmitted);
  }
} 

@Component({
  selector: 'app-residenza-list',
  templateUrl: './residenza-list.component.html',
  styleUrls: ['./residenza-list.component.css']
})
export class ResidenzaListComponent implements OnInit {
  formSubmitted: boolean = false;
  residenze: Residenza[] = [];
  persone: Persona[] = [];
  newResidenzaForm: FormGroup;
  displayedColumns: string[] = ['id', 'indirizzo', 'citta', 'cap', 'id_anagrafica', 'azioni'];
  selectedPersonaId: number | undefined;
  customErrorStateMatcher: CustomErrorStateMatcher;
  hasAvailablePersone: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private residenzaService: ResidenzaService,
    private personaService: PersonaService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private stateService: StateService
  ) {
    this.newResidenzaForm = this.formBuilder.group({
      indirizzo: ['', Validators.required],
      citta: ['', Validators.required],
      cap: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      id_anagrafica: [null, Validators.required]
    });
    this.customErrorStateMatcher = new CustomErrorStateMatcher(this);
  }

  ngOnInit(): void {
    this.loadResidenze();
    this.loadNoResidenza();
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.newResidenzaForm.valid) {
      this.createResidenza();
    } else {
      this.showMessage('Tutti i campi sono obbligatori, inclusa la selezione di una persona.');
    }
  }
  
  private resetForm(): void {
    this.newResidenzaForm.reset();
    this.selectedPersonaId = undefined;
    this.formSubmitted = false;
    this.updateFormState(); // Update form state after resetting
  }

  private updateFormState(): void {
    this.hasAvailablePersone = this.persone.length > 0;
    if (this.hasAvailablePersone) {
      this.newResidenzaForm.enable();
    } else {
      this.newResidenzaForm.disable();
    }
  }
  
  createResidenza(): void {
    if (this.newResidenzaForm.valid) {
      const residenza: Residenza = {
        indirizzo: this.newResidenzaForm.get('indirizzo')?.value,
        citta: this.newResidenzaForm.get('citta')?.value,
        cap: this.newResidenzaForm.get('cap')?.value,
        id_anagrafica: this.selectedPersonaId
      };

      this.residenzaService.create(residenza).subscribe(
        response => {
          if (response.responseCode) {
            this.showMessage('Residenza creata con successo');
            this.loadResidenze();
            this.removePersonaFromNoResidenza(this.selectedPersonaId!);
            this.resetForm();
            this.updateFormState(); 
          } else {
            this.showMessage('Errore nella creazione della residenza: ' + response.msg);
          }
        },
        error => {
          console.error('Errore durante la creazione della residenza:', error);
          this.showMessage('Errore nella creazione della residenza.');
        }
      );
    }
  }
  
  loadResidenze(): void {
    this.residenzaService.list().subscribe(
      response => {
        if (response.responseCode) {
          this.residenze = response.data;
          this.stateService.setHasAvailableResidenze(this.residenze.length > 0);
        }
      },
      error => {
        this.showMessage('Errore nel caricamento delle residenze');
      }
    );
  }

  loadNoResidenza(): void {
    this.personaService.listNoResidenza().subscribe(
      response => {
        if (response.responseCode) {
          this.persone = response.data;
          this.hasAvailablePersone = this.persone.length > 0;
          this.updateFormState();
        }
      },
      error => {
        this.showMessage('Errore nel caricamento delle persone senza residenza');
      }
    );
  }


  private removePersonaFromNoResidenza(id: number): void {
    this.persone = this.persone.filter(persona => persona.id !== id);
    this.hasAvailablePersone = this.persone.length > 0;
    this.updateFormState();
  }

  onPersonaChange(selectedId: number): void {
    console.log('Selected Persona ID changed to:', selectedId);
    this.selectedPersonaId = selectedId;
    this.newResidenzaForm.patchValue({ id_anagrafica: selectedId }); // Imposta il valore del form
  }
 
  removeResidenza(id: number): void {
    const residenzaDaRimuovere = this.residenze.find(r => r.id === id);
    if (!residenzaDaRimuovere) {
      this.showMessage('Residenza non trovata');
      return;
    }

    this.residenzaService.remove(id).subscribe(
      response => {
        if (response.responseCode) {
          this.residenze = this.residenze.filter(residenza => residenza.id !== id);

          if (residenzaDaRimuovere.id_anagrafica) {
            const personaAssociata = this.persone.find(p => p.id === residenzaDaRimuovere.id_anagrafica);
            if (personaAssociata) {
              this.persone.push({
                id: personaAssociata.id,
                nome: personaAssociata.nome || 'Nome non disponibile',
                cognome: personaAssociata.cognome || 'Cognome non disponibile'
              });
            }
            this.showMessage('Residenza eliminata con successo e persona aggiunta alla lista senza residenza');
          } else {
            this.showMessage('Residenza eliminata con successo');
          }
          this.loadNoResidenza();
        } else {
          this.showMessage('Errore nell\'eliminazione: ' + response.msg);
        }
      },
      error => {
        console.error('Errore nell\'eliminazione:', error);
        this.showMessage('Errore nell\'eliminazione della residenza');
      }
    );
  }

  updateResidenza(residenza: Residenza): void {
    const dialogRef = this.dialog.open(ResidenzaEditDialogComponent, {
      width: '360px',
      height: '400px',
      data: { ...residenza }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.isValidResidenza(result)) {
          this.residenzaService.update(result).subscribe(
            response => {
              if (response.responseCode) {
                // Aggiorna l'elemento nella lista locale
                const index = this.residenze.findIndex(r => r.id === result.id);
                if (index !== -1) {
                  this.residenze[index] = { ...result };
                  // Forza l'aggiornamento della vista
                  this.residenze = [...this.residenze];
                }
                this.showMessage('Residenza aggiornata con successo');
              } else {
                this.showMessage('Errore nell\'aggiornamento della residenza: ' + response.msg);
              }
            },
            error => {
              console.error('Errore durante l\'aggiornamento della residenza:', error);
              this.showMessage('Errore nell\'aggiornamento della residenza.');
            }
          );
        } else {
          this.showMessage('I dati forniti non sono validi. Controlla tutti i campi.');
        }
      }
    });
  }

  private isValidResidenza(residenza: Residenza): boolean {
    return !!(residenza.indirizzo && residenza.citta && residenza.cap && !isNaN(residenza.cap));
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Chiudi', {
      duration: 3000,
    });
  }

  clearError(controlName: string): void {
    this.formSubmitted = false; // Resetta il flag di invio del modulo
    this.newResidenzaForm.get(controlName)?.markAsUntouched(); // Rimuove il tocco dal controllo specificato
  }
 
}