import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AdmobService } from './services/admob/admob.service';

import { AdMobFree } from '@ionic-native/admob-free/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    AdMobFree,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AdmobService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
