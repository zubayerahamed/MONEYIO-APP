import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    IonButton,
    IonButtons,
    IonCheckbox,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cashOutline, closeOutline, createOutline, saveOutline, walletOutline } from 'ionicons/icons';

@Component({
    selector: 'app-wallet-modal',
    templateUrl: './wallet-modal.component.html',
    styleUrls: ['./wallet-modal.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonContent,
        IonButtons,
        IonButton,
        IonInput,
        IonIcon,
        IonCheckbox,
        IonItem,
        IonLabel,
    ]
})
export class WalletModalComponent implements OnInit {
    @Input() title: string = 'Add New Wallet';
    @Input() wallet: any;
    walletForm: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private fb: FormBuilder
    ) {
        addIcons({ closeOutline, saveOutline, createOutline, walletOutline, cashOutline });
        this.walletForm = this.fb.group({
            name: ['', Validators.required],
            openingBalance: [null, [Validators.required, Validators.min(0)]],
            isExcluded: [false]
        });
    }

    ngOnInit() {
        if (this.wallet) {
            this.title = 'Edit Wallet';
            this.walletForm.patchValue({
                name: this.wallet.name,
                openingBalance: this.wallet.balance || this.wallet.openingBalance,
                isExcluded: this.wallet.isExcluded
            });
            this.walletForm.get('openingBalance')?.disable();
        }
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    save() {
        if (this.walletForm.valid) {
            this.modalCtrl.dismiss(this.walletForm.getRawValue());
        }
    }
}
