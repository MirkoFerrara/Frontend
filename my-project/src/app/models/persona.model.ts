export interface Persona {
  id?: number;
  nome?: string;
  cognome?: string;
  dataNascita?: string | Date; 
  codiceFiscale?: string;
  indirizzo?: string;
  citta?:string;
  cap?:number;
}