import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'information',
        loadChildren: () => import('../information/information.module').then(m => m.InformationPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'current-requests',
        loadChildren: () => import('../current-requests/current-requests.module').then(m => m.CurrentRequestsPageModule)
      },
      {
        path: 'past-requests',
        loadChildren: () => import('../past-requests/past-requests.module').then(m => m.PastRequestsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: '',
        //redirectTo: '/tabs/home',
        redirectTo: '/sign-in',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    //redirectTo: '/tabs/home',
    redirectTo: '/sign-in',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
