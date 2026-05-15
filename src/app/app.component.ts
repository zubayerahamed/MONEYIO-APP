import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonFooter,
    IonListHeader,
    IonNote
} from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { addIcons } from 'ionicons';
import {
    homeOutline,
    personOutline,
    settingsOutline,
    logOutOutline,
    walletOutline,
    pieChartOutline
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: true,
    imports: [
        IonApp,
        IonRouterOutlet,
        IonMenu,
        IonContent,
        IonList,
        IonItem,
        IonIcon,
        IonLabel,
        IonMenuToggle,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonFooter,
        IonListHeader,
        IonNote,
        RouterLink,
        RouterLinkActive,
        CommonModule
    ],
})
export class AppComponent {
    public appPages = [
        { title: 'Home', url: '/tabs/home', icon: 'home-outline' },
        { title: 'Transactions', url: '/tabs/transaction', icon: 'wallet-outline' },
        { title: 'Status', url: '/tabs/status', icon: 'pie-chart-outline' },
        { title: 'Account', url: '/tabs/account', icon: 'person-outline' },
        { title: 'Settings', url: '/settings', icon: 'settings-outline' },
    ];

    constructor(
        public authService: AuthService,
        private router: Router
    ) {
        addIcons({
            homeOutline,
            personOutline,
            settingsOutline,
            logOutOutline,
            walletOutline,
            pieChartOutline
        });
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
