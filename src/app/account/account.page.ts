import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
    IonToolbar,
    IonCardContent
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, eye, eyeOff, pencil, trash } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Account {
    id: string;
    name: string;
    balance: number;
    isExcluded: boolean;
    color: string;
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
        IonItemOption,
        IonCardContent
    ],
})
export class AccountPage implements OnInit, AfterViewInit {
    @ViewChild('totalChartCanvas') totalChartCanvas!: ElementRef;
    @ViewChild('excludedChartCanvas') excludedChartCanvas!: ElementRef;

    accounts: Account[] = [
        { id: '1', name: 'Cash', balance: 500.50, isExcluded: false, color: '#2dd36f' },
        { id: '2', name: 'Bank Account', balance: 25000.00, isExcluded: false, color: '#3880ff' },
        { id: '3', name: 'Credit Card', balance: -1500.00, isExcluded: false, color: '#eb445a' },
        { id: '4', name: 'Savings', balance: 10000.00, isExcluded: false, color: '#ffc409' },
        { id: '5', name: 'Family Loan', balance: 5000.00, isExcluded: true, color: '#92949c' },
        { id: '6', name: 'Pending Refund', balance: 200.00, isExcluded: true, color: '#5260ff' },
    ];

    totalBalance: number = 0;
    excludedBalance: number = 0;
    
    totalChart: any;
    excludedChart: any;

    constructor() {
        addIcons({ add, eyeOff, eye, pencil, trash });
    }

    ngOnInit() {
        this.calculateTotals();
    }

    ngAfterViewInit() {
        this.initCharts();
    }

    calculateTotals() {
        this.totalBalance = this.accounts
            .filter(a => !a.isExcluded)
            .reduce((sum, a) => sum + a.balance, 0);

        this.excludedBalance = this.accounts
            .filter(a => a.isExcluded)
            .reduce((sum, a) => sum + a.balance, 0);
    }

    initCharts() {
        const includedAccounts = this.accounts.filter(a => !a.isExcluded);
        const excludedAccounts = this.accounts.filter(a => a.isExcluded);

        if (this.totalChartCanvas) {
            this.totalChart = this.createChart(
                this.totalChartCanvas.nativeElement,
                includedAccounts.map(a => a.name),
                includedAccounts.map(a => Math.abs(a.balance)),
                includedAccounts.map(a => a.color)
            );
        }

        if (this.excludedBalance !== 0 && this.excludedChartCanvas) {
            this.excludedChart = this.createChart(
                this.excludedChartCanvas.nativeElement,
                excludedAccounts.map(a => a.name),
                excludedAccounts.map(a => Math.abs(a.balance)),
                excludedAccounts.map(a => a.color)
            );
        }
    }

    createChart(canvas: any, labels: string[], data: number[], colors: string[]) {
        return new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '80%'
            }
        });
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
