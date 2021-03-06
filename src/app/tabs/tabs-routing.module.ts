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
        path: 'handyman-view-all',
        loadChildren: () => import('../handyman-view-all/handyman-view-all.module').then(m => m.HandymanViewAllPageModule)
      },
      {
        path: 'handyman-selected',
        loadChildren: () => import('../handyman-selected/handyman-selected.module').then(m => m.HandymanSelectedPageModule)
      },
      {
        path: 'handyman-send-location',
        loadChildren: () => import('../handyman-send-location/handyman-send-location.module').then(m => m.HandymanSendLocationPageModule)
      },
      {
        path: 'add-job',
        loadChildren: () => import('../add-job/add-job.module').then(m => m.AddJobPageModule)
      },
      {
        path: 'review-and-rating',
        loadChildren: () => import('../review-and-rating/review-and-rating.module').then(m => m.ReviewAndRatingPageModule)
      },
      {
        path: 'complete-the-job',
        loadChildren: () => import('../complete-the-job/complete-the-job.module').then(m => m.CompleteTheJobPageModule)
      },
      {
        path: 'post-a-job',
        loadChildren: () => import('../post-a-job/post-a-job.module').then(m => m.PostAJobPageModule)
      },
      {
        path: 'post-a-job-add',
        loadChildren: () => import('../post-a-job-add/post-a-job-add.module').then(m => m.PostAJobAddPageModule)
      },
      {
        path: 'post-a-job-location',
        loadChildren: () => import('../post-a-job-location/post-a-job-location.module').then(m => m.PostAJobLocationPageModule)
      },
      {
        path: 'view-a-jobs',
        loadChildren: () => import('../view-a-jobs/view-a-jobs.module').then(m => m.ViewAJobsPageModule)
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
