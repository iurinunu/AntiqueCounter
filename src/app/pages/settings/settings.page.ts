import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {


  user;

  constructor(
   // private afAuth: AngularFireAuth
  ) {
    // this.afAuth.authState.subscribe((user) => {
    //   if(!user) {
    //     this.user = user;
    //   }
    // })
   }

  ngOnInit() {
  }

}
