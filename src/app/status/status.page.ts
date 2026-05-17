import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import { Chart, registerables } from 'chart.js';
import { addIcons } from 'ionicons';
import { addCircleOutline, arrowDownCircleOutline, arrowUpCircleOutline, chevronBackOutline, chevronForwardOutline, removeCircleOutline } from 'ionicons/icons';

Chart.register(...registerables);

interface DataItem {
    label: string;
    amount: number;
    color: string;
}

interface GroupedLoan {
    source: string;
    given: number;
    repaidToMe: number;
    taken: number;
    repaidByMe: number;
    color: string;
}

@Component({
    selector: 'app-status',
    templateUrl: 'status.page.html',
    styleUrls: ['status.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonMenuButton,
        IonSegment,
        IonSegmentButton,
        IonLabel,
        IonIcon,
        IonButton,
        IonCard,
        IonCardContent,
        IonList,
        IonItem,
        IonText,
        IonGrid,
        IonRow,
        IonCol
    ],
})
export class StatusPage implements OnInit, AfterViewInit {
    @ViewChild('donutCanvas') private donutCanvas!: ElementRef;

    segmentValue: string = 'monthly';
    statusType: string = 'income';
    currentDate: Date = new Date();
    donutChart: any;

    // Mock data for different types
    incomeData: DataItem[] = [
        { label: 'Salary', amount: 5000, color: '#2dd36f' },
        { label: 'Freelance', amount: 1500, color: '#3dc2ff' },
        { label: 'Investment', amount: 800, color: '#ffc409' },
        { label: 'Gift', amount: 200, color: '#eb445a' }
    ];

    expenseData: DataItem[] = [
        { label: 'Food', amount: 600, color: '#2dd36f' },
        { label: 'Transport', amount: 300, color: '#3dc2ff' },
        { label: 'Rent', amount: 1200, color: '#ffc409' },
        { label: 'Shopping', amount: 450, color: '#eb445a' },
        { label: 'Entertainment', amount: 200, color: '#92949c' }
    ];

    loanSummaryCards = [
        { label: 'Total Loans (Given)', amount: 25000, color: '#eb445a', type: 'given', icon: 'arrow-up-circle-outline' },
        { label: 'Total Repaid (To Me)', amount: 1200, color: '#2dd36f', type: 'repaid-to-me', icon: 'add-circle-outline' },
        { label: 'Total Loans (Taken)', amount: 5000, color: '#2dd36f', type: 'taken', icon: 'arrow-down-circle-outline' },
        { label: 'Total Repaid (By Me)', amount: 1000, color: '#eb445a', type: 'repaid-by-me', icon: 'remove-circle-outline' }
    ];

    groupedLoanList: GroupedLoan[] = [
        { 
            source: 'Rahim', 
            given: 20000, 
            repaidToMe: 100,
            taken: 0,
            repaidByMe: 0,
            color: '#eb445a'
        },
        { 
            source: 'Bank', 
            given: 0, 
            repaidToMe: 0,
            taken: 5000,
            repaidByMe: 1000,
            color: '#2dd36f'
        }
    ];

    constructor() {
        addIcons({ 
            chevronBackOutline, 
            chevronForwardOutline,
            arrowUpCircleOutline,
            addCircleOutline,
            arrowDownCircleOutline,
            removeCircleOutline
        });
    }

    ngOnInit() { }

    ngAfterViewInit() {
        this.createChart();
    }

    segmentChanged(ev: any) {
        this.segmentValue = ev.detail.value;
        this.updateChart();
    }

    statusTypeChanged(ev: any) {
        this.statusType = ev.detail.value;
        if (this.statusType !== 'loan') {
            setTimeout(() => this.createChart(), 0);
        } else {
            if (this.donutChart) {
                this.donutChart.destroy();
                this.donutChart = null;
            }
        }
    }

    get dateDisplay(): string {
        if (this.segmentValue === 'monthly') {
            return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else {
            return this.currentDate.getFullYear().toString();
        }
    }

    get currentData(): any[] {
        if (this.statusType === 'income') return this.incomeData;
        if (this.statusType === 'expense') return this.expenseData;
        return this.groupedLoanList;
    }

    get totalAmount(): number {
        if (this.statusType === 'loan') {
            return this.groupedLoanList.reduce((acc, item) => acc + item.given + item.taken, 0);
        }
        const data = (this.statusType === 'income' ? this.incomeData : this.expenseData);
        return data.reduce((acc, item) => acc + item.amount, 0);
    }

    createChart() {
        if (this.statusType === 'loan' || !this.donutCanvas) return;

        if (this.donutChart) {
            this.donutChart.destroy();
        }

        const data = this.statusType === 'income' ? this.incomeData : this.expenseData;

        this.donutChart = new Chart(this.donutCanvas.nativeElement, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.label),
                datasets: [{
                    data: data.map(d => d.amount),
                    backgroundColor: data.map(d => d.color),
                    hoverOffset: 4,
                    borderWidth: 0
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
                cutout: '75%'
            }
        });
    }

    updateChart() {
        if (this.statusType === 'loan') return;
        
        if (this.donutChart) {
            const data = this.statusType === 'income' ? this.incomeData : this.expenseData;
            this.donutChart.data.labels = data.map(d => d.label);
            this.donutChart.data.datasets[0].data = data.map(d => d.amount);
            this.donutChart.data.datasets[0].backgroundColor = data.map(d => d.color);
            this.donutChart.update();
        } else {
            this.createChart();
        }
    }

    getItemColor(item: any): string {
        if (this.statusType === 'income') return 'success';
        if (this.statusType === 'expense') return 'danger';
        // For grouped loans, color depends on balance
        const balance = (item.given - item.repaidToMe) - (item.taken - item.repaidByMe);
        return balance >= 0 ? 'danger' : 'success';
    }

    getLoanBalance(item: any): number {
        return (item.given || 0) - (item.repaidToMe || 0) + (item.taken || 0) - (item.repaidByMe || 0);
    }

    getLoanDetails(item: any): string[] {
        const details: string[] = [];
        if (item.given > 0 || item.repaidToMe > 0) {
            details.push(`Given: ${item.given} | Paid: ${item.repaidToMe}`);
        }
        if (item.taken > 0 || item.repaidByMe > 0) {
            details.push(`Taken: ${item.taken} | Paid: ${item.repaidByMe}`);
        }
        return details;
    }

    prev() {
        const newDate = new Date(this.currentDate);
        if (this.segmentValue === 'monthly') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        this.currentDate = newDate;
        this.updateChart();
    }

    next() {
        const newDate = new Date(this.currentDate);
        if (this.segmentValue === 'monthly') {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        this.currentDate = newDate;
        this.updateChart();
    }
}
