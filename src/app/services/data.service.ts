import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private incomeSourcesSubject = new BehaviorSubject<string[]>(['Salary', 'Freelance', 'Investment', 'Gift', 'Other']);
  private expenseTypesSubject = new BehaviorSubject<string[]>(['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Other']);
  private walletsSubject = new BehaviorSubject<string[]>(['Cash', 'Bank Account', 'Credit Card', 'Savings']);
  private subExpenseOptionsSubject = new BehaviorSubject<string[]>(['Grocery', 'Fast Food', 'Fuel', 'Bus/Train', 'Cloths', 'Electronics', 'Cinema', 'Games', 'Medicine', 'Gym', 'Internet', 'Electricity', 'Water', 'Other']);

  getIncomeSources(): Observable<string[]> {
    return this.incomeSourcesSubject.asObservable();
  }

  getExpenseTypes(): Observable<string[]> {
    return this.expenseTypesSubject.asObservable();
  }

  getWallets(): Observable<string[]> {
    return this.walletsSubject.asObservable();
  }

  getSubExpenseOptions(): Observable<string[]> {
    return this.subExpenseOptionsSubject.asObservable();
  }

  addIncomeSource(source: string) {
    const current = this.incomeSourcesSubject.value;
    if (!current.includes(source)) {
      this.incomeSourcesSubject.next([...current, source]);
    }
  }

  addExpenseType(type: string) {
    const current = this.expenseTypesSubject.value;
    if (!current.includes(type)) {
      this.expenseTypesSubject.next([...current, type]);
    }
  }

  updateIncomeSource(oldSource: string, newSource: string) {
    const current = this.incomeSourcesSubject.value;
    const index = current.indexOf(oldSource);
    if (index !== -1) {
      current[index] = newSource;
      this.incomeSourcesSubject.next([...current]);
    }
  }

  deleteIncomeSource(source: string) {
    const current = this.incomeSourcesSubject.value;
    this.incomeSourcesSubject.next(current.filter(s => s !== source));
  }

  updateExpenseType(oldType: string, newType: string) {
    const current = this.expenseTypesSubject.value;
    const index = current.indexOf(oldType);
    if (index !== -1) {
      current[index] = newType;
      this.expenseTypesSubject.next([...current]);
    }
  }

  deleteExpenseType(type: string) {
    const current = this.expenseTypesSubject.value;
    this.expenseTypesSubject.next(current.filter(t => t !== type));
  }

  addWallet(wallet: string) {
    const current = this.walletsSubject.value;
    if (!current.includes(wallet)) {
      this.walletsSubject.next([...current, wallet]);
    }
  }

  addSubExpenseOption(option: string) {
    const current = this.subExpenseOptionsSubject.value;
    if (!current.includes(option)) {
      this.subExpenseOptionsSubject.next([...current, option]);
    }
  }
}
