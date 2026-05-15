import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    IonMenuButton,
    IonModal,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, addOutline, arrowForwardOutline, briefcaseOutline, calculatorOutline, calendarOutline, cameraOutline, cardOutline, cartOutline, cashOutline, chevronDownOutline, closeOutline, createOutline, listOutline, searchOutline, trashOutline, walletOutline } from 'ionicons/icons';

interface SubExpense {
    name: string;
    amount: number | null;
}

@Component({
    selector: 'app-transaction',
    templateUrl: 'transaction.page.html',
    styleUrls: ['transaction.page.scss'],
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
        IonMenuButton,
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
export class TransactionPage implements OnInit {
    @ViewChild('amountInput', { static: false }) amountInput!: IonInput;

    transactionForm: FormGroup;
    segmentValue: string = 'expense';
    isDateModalOpen = false;
    isIncomeSourceModalOpen = false;
    isExpenseTypeModalOpen = false;
    isFromWalletModalOpen = false;
    isToWalletModalOpen = false;
    isSubExpenseModalOpen = false;

    // Mock data for selects
    incomeSources = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
    expenseTypes = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Other'];
    wallets = ['Cash', 'Bank Account', 'Credit Card', 'Savings'];

    // Mock data for sub expenses
    subExpenseOptions = ['Grocery', 'Fast Food', 'Fuel', 'Bus/Train', 'Cloths', 'Electronics', 'Cinema', 'Games', 'Medicine', 'Gym', 'Internet', 'Electricity', 'Water', 'Other'];

    subExpenses: SubExpense[] = [];
    filteredSubExpenses: SubExpense[] = [];

    filteredIncomeSources = [...this.incomeSources];
    filteredExpenseTypes = [...this.expenseTypes];
    filteredWallets = [...this.wallets];

    capturedImage: string | null = null;

    constructor(private fb: FormBuilder) {
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

        // Initialize sub-expenses with null amounts
        this.subExpenses = this.subExpenseOptions.map(name => ({ name, amount: null }));
        this.filteredSubExpenses = [...this.subExpenses];

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
        this.updateValidators();
    }

    ionViewDidEnter() {
        setTimeout(() => {
            this.amountInput.setFocus();
        }, 400);
    }

    segmentChanged(ev: any) {
        this.segmentValue = ev.detail.value;
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

    onSave() {
        if (this.transactionForm.valid) {
            console.log('Transaction Saved:', {
                type: this.segmentValue,
                ...this.transactionForm.value,
                image: this.capturedImage,
                subExpenses: this.activeSubExpenses
            });
            // Handle save logic
        }
    }

    onContinue() {
        if (this.transactionForm.valid) {
            console.log('Transaction Continued:', {
                type: this.segmentValue,
                ...this.transactionForm.value,
                image: this.capturedImage,
                subExpenses: this.activeSubExpenses
            });
            // Handle continue logic (e.g., save and reset for next entry)
            this.transactionForm.reset({
                date: new Date().toISOString(),
                amount: ''
            });
            this.capturedImage = null;
            this.subExpenses.forEach(se => se.amount = null);
        }
    }

    openCamera(event: Event) {
        event.stopPropagation();
        console.log('Camera button clicked');
        // For now, setting a dummy image to show the design
        this.capturedImage = 'https://placehold.co/600x400?text=Transaction+Image';
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
}
