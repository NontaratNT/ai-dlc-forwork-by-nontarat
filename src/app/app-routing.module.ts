import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagenotfoundComponent } from './layout/layout-home/components/pagenotfound/pagenotfound.component';

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
    { path: '**', pathMatch: 'full',
        component: PagenotfoundComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule { }
