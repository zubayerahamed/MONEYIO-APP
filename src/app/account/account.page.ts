import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonMenuButton,
    IonNote,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, businessOutline, cardOutline, cashOutline, eye, eyeOff, eyeOffOutline, eyeOutline, helpCircleOutline, pencil, peopleOutline, trash, walletOutline } from 'ionicons/icons';

interface Account {
    id: string;
    name: string;
    balance: number;
    isExcluded: boolean;
    icon: string;
}

@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonMenuButton,
        IonList,
        IonItem,
        IonLabel,
        IonNote,
        IonIcon,
        IonCard,
        IonCardHeader,
        IonCardSubtitle,
        IonCardTitle,
        IonButton,
        IonItemSliding,
        IonItemOptions,
        IonItemOption
    ],
})
export class AccountPage implements OnInit {
    accounts: Account[] = [
        { id: '1', name: 'Cash', balance: 500.50, isExcluded: false, icon: 'cash-outline' },
        { id: '2', name: 'Bank Account', balance: 25000.00, isExcluded: false, icon: 'business-outline' },
        { id: '3', name: 'Credit Card', balance: -1500.00, isExcluded: false, icon: 'card-outline' },
        { id: '4', name: 'Savings', balance: 10000.00, isExcluded: false, icon: 'wallet-outline' },
        { id: '5', name: 'Family Loan', balance: 5000.00, isExcluded: true, icon: 'people-outline' },
        { id: '6', name: 'Pending Refund', balance: 200.00, isExcluded: true, icon: 'help-circle-outline' },
    ];

    totalBalance: number = 0;
    excludedBalance: number = 0;

    constructor() {
        addIcons({ add, eyeOff, eye, pencil, trash, walletOutline, eyeOffOutline, eyeOutline, cashOutline, businessOutline, cardOutline, peopleOutline, helpCircleOutline });
    }

    ngOnInit() {
        this.calculateTotals();
    }

    calculateTotals() {
        this.totalBalance = this.accounts
            .filter(a => !a.isExcluded)
            .reduce((sum, a) => sum + a.balance, 0);

        this.excludedBalance = this.accounts
            .filter(a => a.isExcluded)
            .reduce((sum, a) => sum + a.balance, 0);
    }

    addAccount() {
        console.log('Add account');
    }

    excludeAccount(account: Account) {
        console.log('Exclude account');
    }

    includeAccount(account: Account) {
        console.log('Include account');
    }

    editAccount(account: Account) {
        console.log('Edit account');
    }

    deleteAccount(account: Account) {
        console.log('Delete account');
    }
}
