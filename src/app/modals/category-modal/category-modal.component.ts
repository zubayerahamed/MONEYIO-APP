import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInput,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, createOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButtons,
    IonButton,
    IonInput,
    IonIcon
  ]
})
export class CategoryModalComponent implements OnInit {
  @Input() title: string = 'Add New';
  @Input() categoryName: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, saveOutline, createOutline });
  }

  ngOnInit() {
    if (this.categoryName) {
      this.title = this.title.includes('Edit') ? this.title : 'Edit ' + this.title;
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss(this.categoryName.trim());
  }
}
