import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    IonMenuButton,
    IonTitle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
    add,
    arrowForwardOutline,
    createOutline,
    documentTextOutline,
    imageOutline,
    listOutline,
    peopleOutline,
    receiptOutline,
    swapHorizontalOutline,
    trashOutline,
    trendingDownOutline,
    trendingUpOutline
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
        IonItem
    ],
})
export class TransactionPage {
    transactions: any[] = [];
    groupedTransactions: { date: string, income: number, expense: number, items: any[] }[] = [];

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
            listOutline
        });
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

    groupTransactions() {
        const groups: { [key: string]: { income: number, expense: number, items: any[] } } = {};

        this.transactions.forEach(t => {
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
