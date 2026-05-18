import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonDatetime,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonTitle,
    IonToolbar,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, arrowForwardOutline, briefcaseOutline, calculatorOutline, calendarOutline, cameraOutline, cardOutline, cartOutline, cashOutline, chevronDownOutline, closeOutline, createOutline, listOutline, searchOutline, trashOutline, walletOutline } from 'ionicons/icons';
import { DataService } from '../../services/data.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';
import { WalletModalComponent } from '../wallet-modal/wallet-modal.component';
import { Subscription } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface SubExpense {
    name: string;
    amount: number | null;
}

@Component({
    selector: 'app-transaction-modal',
    templateUrl: './transaction-modal.component.html',
    styleUrls: ['./transaction-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonButtons,
        IonSegment,
        IonSegmentButton,
        IonLabel,
        IonInput,
        IonTextarea,
        IonButton,
        IonIcon,
        IonDatetime,
        IonModal,
        IonGrid,
        IonRow,
        IonCol,
        IonSearchbar,
        IonList,
        IonItem,
    ],
})
export class TransactionModalComponent implements OnInit, OnDestroy {
    @Input() initialSegment: string = 'expense';
    @ViewChild('amountInput', { static: false }) amountInput!: IonInput;

    transactionForm: FormGroup;
    segmentValue: string = 'expense';
    loanSegmentValue: string = 'given';
    isDateModalOpen = false;
    isIncomeSourceModalOpen = false;
    isExpenseTypeModalOpen = false;
    isFromWalletModalOpen = false;
    isToWalletModalOpen = false;
    isSubExpenseModalOpen = false;

    incomeSources: string[] = [];
    expenseTypes: string[] = [];
    wallets: string[] = [];
    subExpenseOptions: string[] = [];

    subExpenses: SubExpense[] = [];
    filteredSubExpenses: SubExpense[] = [];

    filteredIncomeSources: string[] = [];
    filteredExpenseTypes: string[] = [];
    filteredWallets: string[] = [];

    capturedImage: string | null = null;

    private subscriptions: Subscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        private modalCtrl: ModalController
    ) {
        addIcons({
            calendarOutline,
            cashOutline,
            walletOutline,
            addCircleOutline,
            arrowForwardOutline,
            briefcaseOutline,
            cartOutline,
            cardOutline,
            createOutline,
            cameraOutline,
            closeOutline,
            chevronDownOutline,
            searchOutline,
            addOutline,
            listOutline,
            calculatorOutline,
            trashOutline
        });

        this.transactionForm = this.fb.group({
            date: [new Date().toISOString(), Validators.required],
            amount: ['', [Validators.required, Validators.min(0.01)]],
            incomeSource: [''],
            expenseType: [''],
            fromWallet: [''],
            toWallet: [''],
            note: ['']
        });
    }

    ngOnInit() {
        if (this.initialSegment) {
            this.segmentValue = this.initialSegment;
        }
        this.updateValidators();

        this.subscriptions.add(
            this.dataService.getIncomeSources().subscribe(sources => {
                this.incomeSources = sources;
                this.filteredIncomeSources = [...sources];
            })
        );

        this.subscriptions.add(
            this.dataService.getExpenseTypes().subscribe(types => {
                this.expenseTypes = types;
                this.filteredExpenseTypes = [...types];
            })
        );

        this.subscriptions.add(
            this.dataService.getWallets().subscribe(wallets => {
                this.wallets = wallets;
                this.filteredWallets = [...wallets];
            })
        );

        this.subscriptions.add(
            this.dataService.getSubExpenseOptions().subscribe(options => {
                this.subExpenseOptions = options;
                this.subExpenses = this.subExpenseOptions.map(name => ({ name, amount: null }));
                this.filteredSubExpenses = [...this.subExpenses];
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    ionViewDidEnter() {
        setTimeout(() => {
            if (this.amountInput) {
                this.amountInput.setFocus();
            }
        }, 400);
    }

    segmentChanged(ev: any) {
        this.segmentValue = ev.detail.value;
        this.updateValidators();
    }

    loanSegmentChanged(ev: any) {
        this.loanSegmentValue = ev.detail.value;
        this.updateValidators();
    }

    updateValidators() {
        const incomeSourceControl = this.transactionForm.get('incomeSource');
        const expenseTypeControl = this.transactionForm.get('expenseType');
        const fromWalletControl = this.transactionForm.get('fromWallet');
        const toWalletControl = this.transactionForm.get('toWallet');

        // Reset validators
        incomeSourceControl?.clearValidators();
        expenseTypeControl?.clearValidators();
        fromWalletControl?.clearValidators();
        toWalletControl?.clearValidators();

        if (this.segmentValue === 'income') {
            incomeSourceControl?.setValidators([Validators.required]);
            toWalletControl?.setValidators([Validators.required]);
        } else if (this.segmentValue === 'loan') {
            incomeSourceControl?.setValidators([Validators.required]);
            if (this.loanSegmentValue === 'taken' || this.loanSegmentValue === 'repaid-to-me') {
                toWalletControl?.setValidators([Validators.required]);
            } else if (this.loanSegmentValue === 'given' || this.loanSegmentValue === 'repaid-by-me') {
                fromWalletControl?.setValidators([Validators.required]);
            }
        } else if (this.segmentValue === 'expense') {
            expenseTypeControl?.setValidators([Validators.required]);
            fromWalletControl?.setValidators([Validators.required]);
        } else if (this.segmentValue === 'transfer') {
            fromWalletControl?.setValidators([Validators.required]);
            toWalletControl?.setValidators([Validators.required]);
        }

        incomeSourceControl?.updateValueAndValidity();
        expenseTypeControl?.updateValueAndValidity();
        fromWalletControl?.updateValueAndValidity();
        toWalletControl?.updateValueAndValidity();
    }

    async addNewIncomeSource() {
        const title = this.segmentValue === 'income' ? 'Add Income Source' : 'Add Loan Source';
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
            this.dataService.addIncomeSource(data);
            this.selectIncomeSource(data);
        }
    }

    async addNewExpenseType() {
        const modal = await this.modalCtrl.create({
            component: CategoryModalComponent,
            componentProps: { title: 'Add Expense Type' },
            initialBreakpoint: 0.4,
            breakpoints: [0, 0.4],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data) {
            this.dataService.addExpenseType(data);
            this.selectExpenseType(data);
        }
    }

    async addNewWallet() {
        const modal = await this.modalCtrl.create({
            component: WalletModalComponent,
            componentProps: { title: 'Add New Wallet' },
            initialBreakpoint: 0.6,
            breakpoints: [0, 0.6],
            handle: true,
            cssClass: 'selection-modal'
        });
        await modal.present();
        const { data } = await modal.onWillDismiss();
        if (data && data.name) {
            this.dataService.addWallet(data.name);
            if (this.isFromWalletModalOpen) {
                this.selectFromWallet(data.name);
            } else if (this.isToWalletModalOpen) {
                this.selectToWallet(data.name);
            }
        }
    }

    onSave() {
        if (this.transactionForm.valid) {
            const transactionData = {
                type: this.segmentValue,
                loanType: this.segmentValue === 'loan' ? this.loanSegmentValue : null,
                ...this.transactionForm.value,
                image: this.capturedImage,
                subExpenses: this.activeSubExpenses
            };
            console.log('Transaction Saved:', transactionData);
            this.modalCtrl.dismiss(transactionData);
        }
    }

    async openCamera(event: Event) {
        if (event) {
            event.stopPropagation();
        }
        
        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Prompt // Maximum stability across all platforms
            });

            if (image && image.dataUrl) {
                this.capturedImage = image.dataUrl;
            }
        } catch (error: any) {
            console.error('Camera error:', error);
            if (error?.message?.toLowerCase().includes('cancel') || error?.message?.toLowerCase().includes('user closed')) {
                return;
            }
            alert('Camera could not be opened. Please check permissions.');
        }
    }

    removeImage() {
        this.capturedImage = null;
    }

    get formattedDate(): string {
        const value = this.transactionForm.get('date')?.value;

        if (!value) return '';

        return value.split('T')[0];
    }

    onDateChange(event: any) {
        const isoValue = event.detail.value;
        const dateOnly = isoValue.split('T')[0];
        this.transactionForm.patchValue({
            date: dateOnly
        });
        this.isDateModalOpen = false;
    }

    openIncomeSourceModal() {
        this.filteredIncomeSources = [...this.incomeSources];
        this.isIncomeSourceModalOpen = true;
    }

    openExpenseTypeModal() {
        this.filteredExpenseTypes = [...this.expenseTypes];
        this.isExpenseTypeModalOpen = true;
    }

    openFromWalletModal() {
        this.filteredWallets = [...this.wallets];
        this.isFromWalletModalOpen = true;
    }

    openToWalletModal() {
        this.filteredWallets = [...this.wallets];
        this.isToWalletModalOpen = true;
    }

    searchIncomeSource(ev: any) {
        const val = ev.target.value;
        if (val && val.trim() !== '') {
            this.filteredIncomeSources = this.incomeSources.filter((item) => {
                return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
        } else {
            this.filteredIncomeSources = [...this.incomeSources];
        }
    }

    searchExpenseType(ev: any) {
        const val = ev.target.value;
        if (val && val.trim() !== '') {
            this.filteredExpenseTypes = this.expenseTypes.filter((item) => {
                return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
        } else {
            this.filteredExpenseTypes = [...this.expenseTypes];
        }
    }

    searchWallet(ev: any) {
        const val = ev.target.value;
        if (val && val.trim() !== '') {
            this.filteredWallets = this.wallets.filter((item) => {
                return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
        } else {
            this.filteredWallets = [...this.wallets];
        }
    }

    searchSubExpense(ev: any) {
        const val = ev.target.value;
        if (val && val.trim() !== '') {
            this.filteredSubExpenses = this.subExpenses.filter((item) => {
                return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
            });
        } else {
            this.filteredSubExpenses = [...this.subExpenses];
        }
    }

    selectIncomeSource(source: string) {
        this.transactionForm.patchValue({ incomeSource: source });
        this.isIncomeSourceModalOpen = false;
    }

    selectExpenseType(type: string) {
        this.transactionForm.patchValue({ expenseType: type });
        this.isExpenseTypeModalOpen = false;
    }

    selectFromWallet(wallet: string) {
        this.transactionForm.patchValue({ fromWallet: wallet });
        this.isFromWalletModalOpen = false;
    }

    selectToWallet(wallet: string) {
        this.transactionForm.patchValue({ toWallet: wallet });
        this.isToWalletModalOpen = false;
    }

    get activeSubExpenses() {
        return this.subExpenses.filter(se => se.amount !== null && se.amount > 0);
    }

    get isExpenseTypeSelected(): boolean {
        return !!this.transactionForm.get('expenseType')?.value;
    }

    openSubExpenseModal() {
        this.filteredSubExpenses = [...this.subExpenses];
        this.isSubExpenseModalOpen = true;
    }

    closeSubExpenseModal() {
        this.isSubExpenseModalOpen = false;
    }

    calculateTotal() {
        const total = this.activeSubExpenses.reduce((sum, se) => sum + (se.amount || 0), 0);
        this.transactionForm.patchValue({ amount: total > 0 ? total.toFixed(2) : '' });
    }

    removeSubExpense(se: SubExpense) {
        const item = this.subExpenses.find(s => s.name === se.name);
        if (item) {
            item.amount = null;
            this.calculateTotal();
        }
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    getHeaderColor() {
        switch(this.segmentValue) {
            case 'income': return 'success';
            case 'expense': return 'danger';
            case 'loan': return 'warning';
            case 'transfer': return 'primary';
            default: return 'primary';
        }
    }
}
