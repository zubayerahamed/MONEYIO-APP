import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenuButton,
    IonNote,
    IonRadio,
    IonRadioGroup,
    IonTitle,
    IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { colorPaletteOutline, moonOutline, sunnyOutline, desktopOutline } from 'ionicons/icons';
import { ThemeService, ThemeMode } from '../services/theme.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
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
        IonList,
        IonListHeader,
        IonItem,
        IonLabel,
        IonRadioGroup,
        IonRadio,
        IonIcon,
        IonNote
    ]
})
export class SettingsPage implements OnInit {
    currentTheme: ThemeMode = 'system';

    constructor(private themeService: ThemeService) {
        addIcons({ colorPaletteOutline, moonOutline, sunnyOutline, desktopOutline });
    }

    ngOnInit() {
        this.themeService.theme$.subscribe(theme => {
            this.currentTheme = theme;
        });
    }

    themeChanged(ev: any) {
        this.themeService.setTheme(ev.detail.value);
    }
}
