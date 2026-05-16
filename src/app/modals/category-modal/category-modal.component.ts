import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonItem, 
  IonLabel, 
  IonInput,
  ModalController,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, saveOutline, createOutline } from 'ionicons/icons';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonButton, 
    IonItem, 
    IonLabel, 
    IonInput,
    IonIcon
  ]
})
export class CategoryModalComponent implements OnInit {
  @Input() title: string = 'Add New';
  categoryName: string = '';

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, saveOutline, createOutline });
  }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss(this.categoryName.trim());
  }
}
