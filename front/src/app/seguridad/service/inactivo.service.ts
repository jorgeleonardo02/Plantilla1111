import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InactivoService {
  private inactivityTimeout = 1800; // Tiempo de inactividad en segundos (por ejemplo, 30 minutos)
  private inactivityTimer: any;
  private inactivitySubject = new Subject<void>();

  constructor() {
    this.initInactivityDetection();
  }

  private initInactivityDetection(): void {
    document.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    document.addEventListener('keypress', this.resetInactivityTimer.bind(this));
    this.startInactivityTimer();
  }

  private startInactivityTimer(): void {
    this.inactivityTimer = setTimeout(() => {
      this.inactivitySubject.next();
    }, this.inactivityTimeout * 1000);
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimer);
    this.startInactivityTimer();
  }

  public getInactivityObservable(): Observable<void> {
    return this.inactivitySubject.asObservable();
  }
}