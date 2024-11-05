import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

// Componenti
import { AppComponent } from './app.component';
import { PersonaListComponent } from './components/persona-list/persona-list.component';
import { GestioneComponent } from './components/gestione/gestione.component';
import { ResidenzaListComponent } from './components/residenza-list/residenza-list.component';
import { ResidenzaEditDialogComponent } from './components/residenza-edit-dialog/residenza-edit-dialog.component'; // Assicurati che il percorso sia corretto

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select'; 
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    PersonaListComponent,
    GestioneComponent,
    ResidenzaListComponent,
    ResidenzaEditDialogComponent
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule, 
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSelectModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatError
  ],
  providers: [  { provide: MAT_DATE_LOCALE, useValue: 'it-IT' } , provideHttpClient(withFetch()) ],
  bootstrap: [AppComponent]})

export class AppModule { }