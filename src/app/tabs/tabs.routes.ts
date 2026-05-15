import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadComponent: () =>
                    import('../home/home.page').then((m) => m.HomePage),
            },
            {
                path: 'transaction',
                loadComponent: () =>
                    import('../transaction/transaction.page').then((m) => m.TransactionPage),
            },
            {
                path: 'status',
                loadComponent: () =>
                    import('../status/status.page').then((m) => m.StatusPage),
            },
            {
                path: 'account',
                loadComponent: () =>
                    import('../account/account.page').then((m) => m.AccountPage),
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
    },
];
