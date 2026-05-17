import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
    },
    {
        path: 'category',
        loadComponent: () => import('./category/category.page').then(m => m.CategoryPage),
        canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage),
        canActivate: [AuthGuard]
    },
];
