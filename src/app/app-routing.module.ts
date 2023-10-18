import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './layout/layout-home/components/pagenotfound/pagenotfound.component';
import { Page1Component } from './layout/layout-home/components/page1/page1.component';

const routes: Routes = [
    { path: 'home', redirectTo: '', pathMatch: 'full', },
    {
        path: '',
        loadChildren: () => import('./layout/layout-home/layout-home.module').then(m => m.LayoutHomeModule)
    },
    {
        path: 'main',
        loadChildren: () => import('./layout/layout-desktop/layout-desktop.module').then(m => m.LayoutDesktopModule)
    },
    {
        path: 'mobile',
        loadChildren: () => import('./layout/layout-mobile/layout-mobile.module').then(m => m.LayoutMobileModule)
    },
    // { path: 'pct-in', redirectTo: 'https://officer.thaipoliceonline.com/pct-in/', pathMatch: 'full', },
    { path: 'pct-in', component: Page1Component },
    { path: 'pct-in/login', component: Page1Component },
    { path: '**', pathMatch: 'full',
        component: PagenotfoundComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }
