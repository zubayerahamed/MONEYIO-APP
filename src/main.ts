import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { applyPolyfills, defineCustomElements } from '@ionic/pwa-elements/loader/index.es2017.js';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Call the element loader after the platform has been bootstrapped
applyPolyfills().then(() => {
    defineCustomElements(window);
});

bootstrapApplication(AppComponent, {
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideIonicAngular(),
        provideRouter(routes, withPreloading(PreloadAllModules)),
    ],
});
