import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonIcon,
    IonInput,
    IonLabel,
    IonMenuButton,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, arrowForwardOutline, briefcaseOutline, calendarOutline, cameraOutline, cardOutline, cartOutline, cashOutline, closeOutline, createOutline, walletOutline, chevronDownOutline } from 'ionicons/icons';

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
        IonCol
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

    // Mock data for selects
    incomeSources = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
    expenseTypes = ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Other'];
    wallets = ['Cash', 'Bank Account', 'Credit Card', 'Savings'];
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
            chevronDownOutline
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
                image: this.capturedImage
            });
            // Handle save logic
        }
    }

    onContinue() {
        if (this.transactionForm.valid) {
            console.log('Transaction Continued:', {
                type: this.segmentValue,
                ...this.transactionForm.value,
                image: this.capturedImage
            });
            // Handle continue logic (e.g., save and reset for next entry)
            this.transactionForm.reset({
                date: new Date().toISOString(),
                amount: ''
            });
            this.capturedImage = null;
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
        console.log('openIncomeSourceModal called');
        this.isIncomeSourceModalOpen = true;
    }

    openExpenseTypeModal() {
        console.log('openExpenseTypeModal called');
        this.isExpenseTypeModalOpen = true;
    }

    openFromWalletModal() {
        console.log('openFromWalletModal called');
        this.isFromWalletModalOpen = true;
    }

    openToWalletModal() {
        console.log('openToWalletModal called');
        this.isToWalletModalOpen = true;
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
}
