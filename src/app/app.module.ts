import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { FilePath } from '@awesome-cordova-plugins/file-path/ngx';
import { Chooser } from '@awesome-cordova-plugins/chooser/ngx';
import { FileTransfer } from '@awesome-cordova-plugins/file-transfer/ngx';
import { Push } from '@awesome-cordova-plugins/push/ngx';
//::FIREBASE:://
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
//::FIREBASE:://
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: 
  [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),//imports firebase/app needed for everything
    AngularFireDatabaseModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: [
    HttpClient,
    Geolocation,
    NativeGeocoder,
    InAppBrowser,
    Camera,
    File,
    FilePath,
    Chooser,
    FileTransfer,
    Push,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
