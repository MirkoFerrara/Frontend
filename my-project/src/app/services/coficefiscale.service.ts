import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodiceFiscaleService {
  private readonly MESI = "ABCDEHLMPRST";
  private readonly CONSONANTI = /[BCDFGHJKLMNPQRSTVWXYZ]/g;
  private readonly VOCALI = /[AEIOU]/g;

  calcolaPrimiUndiciCaratteri(nome: string, cognome: string, dataNascita: Date): string {
    const cfCognome = this.calcolaCognome(cognome);
    const cfNome = this.calcolaNome(nome);
    const cfDataNascita = this.calcolaDataNascita(dataNascita);
    
    return cfCognome + cfNome + cfDataNascita;
  }

  private calcolaCognome(cognome: string): string {
    const cleaned = this.pulisciStringa(cognome);
    const consonanti = cleaned.match(this.CONSONANTI) || [];
    const vocali = cleaned.match(this.VOCALI) || [];
    let cf = consonanti.join('') + vocali.join('') + 'XXX';
    return cf.substring(0, 3);
  }

  private calcolaNome(nome: string): string {
    const cleaned = this.pulisciStringa(nome);
    const consonanti = cleaned.match(this.CONSONANTI) || [];
    const vocali = cleaned.match(this.VOCALI) || [];
    
    let cf;
    if (consonanti.length > 3) {
      cf = consonanti[0] + consonanti[2] + consonanti[3];
    } else {
      cf = consonanti.join('') + vocali.join('') + 'XXX';
    }
    return cf.substring(0, 3);
  }

  private calcolaDataNascita(dataNascita: Date): string {
    const anno = dataNascita.getFullYear().toString().substr(-2);
    const mese = this.MESI[dataNascita.getMonth()];
    const giorno = dataNascita.getDate().toString().padStart(2, '0');
    
    return anno + mese + giorno;
  }

  private pulisciStringa(str: string): string {
    return str.toUpperCase()
              .replace(/[^A-Z]/g, '')
              .replace(/[ÀÁÂÃ]/g, 'A')
              .replace(/[ÈÉÊ]/g, 'E')
              .replace(/[ÌÍÎ]/g, 'I')
              .replace(/[ÒÓÔÕ]/g, 'O')
              .replace(/[ÙÚÛ]/g, 'U');
  }

  estraiDataDaCodiceFiscale(cf: string): Date | null {
    if (cf.length < 11) return null;
    
    const anno = parseInt(cf.substr(6, 2));
    const mese = this.MESI.indexOf(cf[8]);
    const giorno = parseInt(cf.substr(9, 2));
    
    const annoCompleto = anno + (anno < 30 ? 2000 : 1900);
    return new Date(annoCompleto, mese, giorno);
  }

  confrontaDate(data1: Date, data2: Date): boolean {
    return data1.getFullYear() === data2.getFullYear() &&
           data1.getMonth() === data2.getMonth() &&
           data1.getDate() === data2.getDate();
  }
}