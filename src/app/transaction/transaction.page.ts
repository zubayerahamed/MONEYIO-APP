import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonButtons,
    IonContent,
    IonFab,
    IonFabButton,
    IonFabList,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    add,
    arrowForwardOutline,
    chevronBackOutline,
    chevronForwardOutline,
    createOutline,
    documentTextOutline,
    imageOutline,
    listOutline,
    peopleOutline,
    receiptOutline,
    swapHorizontalOutline,
    trashOutline,
    trendingDownOutline,
    trendingUpOutline,
    walletOutline
} from 'ionicons/icons';
import { TransactionModalComponent } from '../modals/transaction-modal/transaction-modal.component';

@Component({
    selector: 'app-transaction',
    templateUrl: 'transaction.page.html',
    styleUrls: ['transaction.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonMenuButton,
        IonFab,
        IonFabButton,
        IonFabList,
        IonIcon,
        IonAccordion,
        IonAccordionGroup,
        IonButton,
        IonItem,
        IonSegment,
        IonSegmentButton,
        IonLabel
    ],
})
export class TransactionPage implements OnInit {
    transactions: any[] = [];
    groupedTransactions: { date: string, income: number, expense: number, items: any[] }[] = [];
    
    segmentValue: string = 'monthly';
    currentDate: Date = new Date();

    constructor(private modalCtrl: ModalController) {
        addIcons({
            add,
            trendingUpOutline,
            trendingDownOutline,
            peopleOutline,
            swapHorizontalOutline,
            receiptOutline,
            trashOutline,
            createOutline,
            imageOutline,
            documentTextOutline,
            arrowForwardOutline,
            listOutline,
            chevronBackOutline,
            chevronForwardOutline,
            walletOutline
        });

        // Initialize with some mock data for better visualization
        const now = new Date();
        this.transactions = [
            {
                date: now.toISOString(),
                amount: '1200.00',
                type: 'income',
                incomeSource: 'Salary',
                toWallet: 'Bank',
                note: 'Monthly salary credit'
            },
            {
                date: now.toISOString(),
                amount: '45.50',
                type: 'expense',
                expenseType: 'Food',
                fromWallet: 'Cash',
                subExpenses: [
                    { name: 'Lunch', amount: 30.00 },
                    { name: 'Coffee', amount: 15.50 }
                ]
            },
            {
                date: now.toISOString(),
                amount: '500.00',
                type: 'transfer',
                fromWallet: 'Bank',
                toWallet: 'Cash',
                note: 'ATM Withdrawal'
            }
        ];
    }

    ngOnInit() {
        this.groupTransactions();
    }

    async openTransactionModal(initialSegment: string) {
        const modal = await this.modalCtrl.create({
            component: TransactionModalComponent,
            componentProps: {
                initialSegment: initialSegment
            }
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            this.transactions.unshift(data);
            this.groupTransactions();
        }
    }

    segmentChanged(ev: any) {
        this.segmentValue = ev.detail.value;
        this.groupTransactions();
    }

    get dateDisplay(): string {
        if (this.segmentValue === 'monthly') {
            return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else {
            return this.currentDate.getFullYear().toString();
        }
    }

    prev() {
        const newDate = new Date(this.currentDate);
        if (this.segmentValue === 'monthly') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        this.currentDate = newDate;
        this.groupTransactions();
    }

    next() {
        const newDate = new Date(this.currentDate);
        if (this.segmentValue === 'monthly') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        this.currentDate = newDate;
        this.groupTransactions();
    }

    groupTransactions() {
        const groups: { [key: string]: { income: number, expense: number, items: any[] } } = {};

        const filteredTransactions = this.transactions.filter(t => {
            const tDate = new Date(t.date);
            if (this.segmentValue === 'monthly') {
                return tDate.getMonth() === this.currentDate.getMonth() && 
                       tDate.getFullYear() === this.currentDate.getFullYear();
            } else {
                return tDate.getFullYear() === this.currentDate.getFullYear();
            }
        });

        filteredTransactions.forEach(t => {
            const date = t.date.split('T')[0];
            if (!groups[date]) {
                groups[date] = { income: 0, expense: 0, items: [] };
            }

            const amount = parseFloat(t.amount) || 0;
            if (t.type === 'income' || (t.type === 'loan' && (t.loanType === 'taken' || t.loanType === 'repaid-to-me'))) {
                groups[date].income += amount;
            } else if (t.type === 'expense' || (t.type === 'loan' && (t.loanType === 'given' || t.loanType === 'repaid-by-me'))) {
                groups[date].expense += amount;
            }

            groups[date].items.push(t);
        });

        this.groupedTransactions = Object.keys(groups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(date => ({
                date,
                income: groups[date].income,
                expense: groups[date].expense,
                items: groups[date].items
            }));
    }

    getTransactionIcon(transaction: any) {
        switch (transaction.type) {
            case 'income': return 'trending-up-outline';
            case 'expense': return 'trending-down-outline';
            case 'loan': return 'people-outline';
            case 'transfer': return 'swap-horizontal-outline';
            default: return 'receipt-outline';
        }
    }

    getTransactionColor(transaction: any) {
        switch (transaction.type) {
            case 'income': return 'success';
            case 'expense': return 'danger';
            case 'loan': return 'warning';
            case 'transfer': return 'primary';
            default: return 'medium';
        }
    }

    editTransaction(transaction: any, event: Event) {
        event.stopPropagation();
        console.log('Edit transaction:', transaction);
        // Implement edit logic
    }

    deleteTransaction(transaction: any, event: Event) {
        event.stopPropagation();
        this.transactions = this.transactions.filter(t => t !== transaction);
        this.groupTransactions();
    }
}
