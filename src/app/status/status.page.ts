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
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

Chart.register(...registerables);

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
        IonText
    ],
})
export class StatusPage implements OnInit, AfterViewInit {
    @ViewChild('donutCanvas') private donutCanvas!: ElementRef;

    segmentValue: string = 'monthly';
    statusType: string = 'income';
    currentDate: Date = new Date();
    donutChart: any;

    // Mock data for different types
    incomeData = [
        { label: 'Salary', amount: 5000, color: '#2dd36f' },
        { label: 'Freelance', amount: 1500, color: '#3dc2ff' },
        { label: 'Investment', amount: 800, color: '#ffc409' },
        { label: 'Gift', amount: 200, color: '#eb445a' }
    ];

    expenseData = [
        { label: 'Food', amount: 600, color: '#2dd36f' },
        { label: 'Transport', amount: 300, color: '#3dc2ff' },
        { label: 'Rent', amount: 1200, color: '#ffc409' },
        { label: 'Shopping', amount: 450, color: '#eb445a' },
        { label: 'Entertainment', amount: 200, color: '#92949c' }
    ];

    loanData = [
        { label: 'Personal Loan', amount: 10000, color: '#3880ff' },
        { label: 'Car Loan', amount: 25000, color: '#7044ff' },
        { label: 'Home Loan', amount: 150000, color: '#2dd36f' },
        { label: 'Student Loan', amount: 15000, color: '#ffce00' }
    ];

    constructor() {
        addIcons({ chevronBackOutline, chevronForwardOutline });
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
        this.updateChart();
    }

    get dateDisplay(): string {
        if (this.segmentValue === 'monthly') {
            return this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        } else {
            return this.currentDate.getFullYear().toString();
        }
    }

    get currentData() {
        if (this.statusType === 'income') return this.incomeData;
        if (this.statusType === 'expense') return this.expenseData;
        return this.loanData;
    }

    get totalAmount(): number {
        return this.currentData.reduce((acc, item) => acc + item.amount, 0);
    }

    createChart() {
        if (this.donutChart) {
            this.donutChart.destroy();
        }

        const data = this.currentData;

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
        if (this.donutChart) {
            const data = this.currentData;
            this.donutChart.data.labels = data.map(d => d.label);
            this.donutChart.data.datasets[0].data = data.map(d => d.amount);
            this.donutChart.data.datasets[0].backgroundColor = data.map(d => d.color);
            this.donutChart.update();
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
