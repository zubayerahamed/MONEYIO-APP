import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
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
    ModalController
} from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import { add, eye, eyeOff, pencil, trash } from 'ionicons/icons';
import { WalletModalComponent } from '../modals/wallet-modal/wallet-modal.component';

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

    constructor(private modalCtrl: ModalController) {
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
        if (this.totalChart) this.totalChart.destroy();
        if (this.excludedChart) this.excludedChart.destroy();

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

    async addAccount() {
        const modal = await this.modalCtrl.create({
            component: WalletModalComponent,
            initialBreakpoint: 0.6,
            breakpoints: [0, 0.6],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            const newAccount: Account = {
                id: Date.now().toString(),
                name: data.name,
                balance: data.openingBalance,
                isExcluded: data.isExcluded,
                color: this.getRandomColor()
            };
            this.accounts.push(newAccount);
            this.updateUI();
        }
    }

    async editAccount(account: Account) {
        const modal = await this.modalCtrl.create({
            component: WalletModalComponent,
            componentProps: { wallet: account },
            initialBreakpoint: 0.6,
            breakpoints: [0, 0.6],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            const index = this.accounts.findIndex(a => a.id === account.id);
            if (index !== -1) {
                this.accounts[index] = {
                    ...account,
                    name: data.name,
                    balance: data.openingBalance,
                    isExcluded: data.isExcluded
                };
                this.updateUI();
            }
        }
    }

    private updateUI() {
        this.calculateTotals();
        setTimeout(() => this.initCharts(), 0);
    }

    private getRandomColor() {
        const colors = ['#2dd36f', '#3880ff', '#eb445a', '#ffc409', '#92949c', '#5260ff', '#3dc2ff', '#5260ff', '#2fdf75', '#ffd534'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    excludeAccount(account: Account) {
        account.isExcluded = true;
        this.updateUI();
    }

    includeAccount(account: Account) {
        account.isExcluded = false;
        this.updateUI();
    }

    deleteAccount(account: Account) {
        this.accounts = this.accounts.filter(a => a.id !== account.id);
        this.updateUI();
    }
}
