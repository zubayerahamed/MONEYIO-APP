import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<ThemeMode>('system');
  theme$ = this.themeSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.applyTheme('system');
    }
  }

  setTheme(mode: ThemeMode) {
    this.themeSubject.next(mode);
    localStorage.setItem('theme-mode', mode);
    this.applyTheme(mode);
  }

  private applyTheme(mode: ThemeMode) {
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}
