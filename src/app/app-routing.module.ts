import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./information/information.module').then( m => m.InformationPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'current-requests',
    loadChildren: () => import('./current-requests/current-requests.module').then( m => m.CurrentRequestsPageModule)
  },
  {
    path: 'past-requests',
    loadChildren: () => import('./past-requests/past-requests.module').then( m => m.PastRequestsPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'review-rating',
    loadChildren: () => import('./review-rating/review-rating.module').then( m => m.ReviewRatingPageModule)
  },
  {
    path: 'handyman-view-all',
    loadChildren: () => import('./handyman-view-all/handyman-view-all.module').then( m => m.HandymanViewAllPageModule)
  },
  {
    path: 'handyman-selected',
    loadChildren: () => import('./handyman-selected/handyman-selected.module').then( m => m.HandymanSelectedPageModule)
  },
  {
    path: 'handyman-send-location',
    loadChildren: () => import('./handyman-send-location/handyman-send-location.module').then( m => m.HandymanSendLocationPageModule)
  },
  {
    path: 'add-job',
    loadChildren: () => import('./add-job/add-job.module').then( m => m.AddJobPageModule)
  },
  {
    path: 'job-location-on-map',
    loadChildren: () => import('./job-location-on-map/job-location-on-map.module').then( m => m.JobLocationOnMapPageModule)
  },
  {
    path: 'review-and-rating',
    loadChildren: () => import('./review-and-rating/review-and-rating.module').then( m => m.ReviewAndRatingPageModule)
  },
  {
    path: 'complete-the-job',
    loadChildren: () => import('./complete-the-job/complete-the-job.module').then( m => m.CompleteTheJobPageModule)
  },
  {
    path: 'reschedule-job',
    loadChildren: () => import('./reschedule-job/reschedule-job.module').then( m => m.RescheduleJobPageModule)
  },
  {
    path: 'messages-customer-handyman',
    loadChildren: () => import('./messages-customer-handyman/messages-customer-handyman.module').then( m => m.MessagesCustomerHandymanPageModule)
  },
  {
    path: 'post-a-job',
    loadChildren: () => import('./post-a-job/post-a-job.module').then( m => m.PostAJobPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
