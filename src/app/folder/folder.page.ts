import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { StorageService } from './../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CounterItem } from '../services/storage.service';
import { AdmobService } from '../services/admob/admob.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public counter: number;
  public id: string;
  public limit: number;

  private userId;

  up;

  public updateItem: CounterItem = <CounterItem>{};

  constructor(private activatedRoute: ActivatedRoute, private storageService: StorageService,
    private admobService: AdmobService, private platform: Platform, private db: AngularFirestore,
    private afAuth: AngularFireAuth,) { 

      

      
     
    }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.counter = parseInt(this.activatedRoute.snapshot.paramMap.get('counter'));
    this.id = this.activatedRoute.snapshot.paramMap.get('dateId');
    this.limit = parseInt(this.activatedRoute.snapshot.paramMap.get('limit'));
    if (this.id == '0') { 
      this.limit= Infinity;
    }

    this.afAuth.authState.subscribe((user) => {
      if(!user) {
        return;

      } else {


    console.log(user);

    this.userId = user.uid; 


    this.db.collection(`users/${user.uid}/counters`).snapshotChanges().subscribe(colSnap => {
      let items = [];
      colSnap.forEach(a => {
        let item: any = a.payload.doc.data();
        if (this.id === a.payload.doc.id) {
          this.counter = item.counter;

        }
        // item['id'] = a.payload.doc.id;
        items.push(item);
      });
      console.log(items);
    });

      }
      
    });

    //this.admobService.showBanner();
    // this.counter = 0;
    //this.showBanner();
  }


  
  plus() {

 
 this.counter++;
    let counter = this.counter;
        if (this.id != '0') {

          console.log(`users/${this.userId}/counters/${this.id}`);

      this.db.doc(`users/${this.userId}/counters/${this.id}`).set({
        
        counter: counter,
        
      }, {merge: true});

      this.updateItem.id = this.id;
      this.updateItem.name = this.id;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;
  
      // this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
    
  }

  minus() {
    this.counter--;
    let counter = this.counter;
    if (this.id != '0') {

      
      this.db.doc(`users/${this.userId}/counters/${this.id}`).set({
        
        counter: counter,
        
      }, {merge: true});


      this.updateItem.id = this.id;
      this.updateItem.name = this.id;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;

  
      // this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
  }

  reset() {
    this.counter=0;
    let counter = this.counter;
        if (this.id != '0') {

      this.db.doc(`users/${this.userId}/counters/${this.id}`).set({
        
        counter: counter,
        
      }, {merge: true});


      this.updateItem.id = this.id;
      this.updateItem.name = this.id;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;

  
      //this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
  }

}
