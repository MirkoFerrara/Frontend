import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private hasAvailableResidenzeSubject = new BehaviorSubject<boolean>(false);
  hasAvailableResidenze$ = this.hasAvailableResidenzeSubject.asObservable();

  setHasAvailableResidenze(hasResidenze: boolean) {
    this.hasAvailableResidenzeSubject.next(hasResidenze);
  }
}