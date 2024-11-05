import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importazione dei componenti
import { PersonaListComponent } from './components/persona-list/persona-list.component';
import { ResidenzaListComponent } from './components/residenza-list/residenza-list.component';
import { GestioneComponent } from './components/gestione/gestione.component';

const routes: Routes = [
  { path: '', redirectTo: '/gestione', pathMatch: 'full' }, 
  { path: 'gestione', component: GestioneComponent }, 
  { path: 'persone', component: PersonaListComponent }, 
  { path: 'residenze', component: ResidenzaListComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }