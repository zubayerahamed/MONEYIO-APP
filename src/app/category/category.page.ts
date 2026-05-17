import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonButton,
    IonButtons,
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
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, briefcaseOutline, cartOutline, pencil, trash } from 'ionicons/icons';
import { DataService } from '../services/data.service';
import { CategoryModalComponent } from '../modals/category-modal/category-modal.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-category',
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonMenuButton,
        IonSegment,
        IonSegmentButton,
        IonLabel,
        IonList,
        IonItem,
        IonItemSliding,
        IonItemOptions,
        IonItemOption,
        IonIcon,
        IonButton
    ]
})
export class CategoryPage implements OnInit, OnDestroy {
    segmentValue: string = 'expense';
    categories: string[] = [];
    private subscriptions: Subscription = new Subscription();

    constructor(
        private dataService: DataService,
        private modalCtrl: ModalController
    ) {
        addIcons({ add, pencil, trash, cartOutline, briefcaseOutline });
    }

    ngOnInit() {
        this.loadCategories();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    segmentChanged(ev: any) {
        this.segmentValue = ev.detail.value;
        this.loadCategories();
    }

    loadCategories() {
        // Unsubscribe from previous category subscription if exists
        this.subscriptions.unsubscribe();
        this.subscriptions = new Subscription();

        if (this.segmentValue === 'income' || this.segmentValue === 'loan') {
            this.subscriptions.add(
                this.dataService.getIncomeSources().subscribe(sources => {
                    this.categories = sources;
                })
            );
        } else {
            this.subscriptions.add(
                this.dataService.getExpenseTypes().subscribe(types => {
                    this.categories = types;
                })
            );
        }
    }

    async addCategory() {
        const title = this.segmentValue === 'income' ? 'Add Income Source' : 
                     (this.segmentValue === 'loan' ? 'Add Loan Source' : 'Add Expense Type');
        
        const modal = await this.modalCtrl.create({
            component: CategoryModalComponent,
            componentProps: { title: title },
            initialBreakpoint: 0.4,
            breakpoints: [0, 0.4],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            if (this.segmentValue === 'income' || this.segmentValue === 'loan') {
                this.dataService.addIncomeSource(data);
            } else {
                this.dataService.addExpenseType(data);
            }
        }
    }

    async editCategory(category: string) {
        const title = this.segmentValue === 'income' ? 'Edit Income Source' : 
                     (this.segmentValue === 'loan' ? 'Edit Loan Source' : 'Edit Expense Type');

        const modal = await this.modalCtrl.create({
            component: CategoryModalComponent,
            componentProps: { 
                title: title,
                categoryName: category
            },
            initialBreakpoint: 0.4,
            breakpoints: [0, 0.4],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            if (this.segmentValue === 'income' || this.segmentValue === 'loan') {
                this.dataService.updateIncomeSource(category, data);
            } else {
                this.dataService.updateExpenseType(category, data);
            }
        }
    }

    deleteCategory(category: string) {
        if (this.segmentValue === 'income' || this.segmentValue === 'loan') {
            this.dataService.deleteIncomeSource(category);
        } else {
            this.dataService.deleteExpenseType(category);
        }
    }
}
