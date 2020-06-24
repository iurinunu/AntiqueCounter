import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
     firebase.auth.EmailAuthProvider.PROVIDER_ID
    
  ],
  // tosUrl: '<your-tos-link>',
  // privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.NONE
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    FormsModule,
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)
  ],
  declarations: [LoginPage],
  entryComponents: [LoginPage]
})
export class LoginPageModule {}
