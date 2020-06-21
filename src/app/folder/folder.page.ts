import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { StorageService } from './../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CounterItem } from '../services/storage.service';
import { AdmobService } from '../services/admob/admob.service';

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

  public updateItem: CounterItem = <CounterItem>{};

  constructor(private activatedRoute: ActivatedRoute, private storageService: StorageService,
    private admobService: AdmobService, private platform: Platform, private db: AngularFirestore) { 

      

      
     
    }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.counter = parseInt(this.activatedRoute.snapshot.paramMap.get('counter'));
    this.id = this.activatedRoute.snapshot.paramMap.get('dateId');
    this.limit = parseInt(this.activatedRoute.snapshot.paramMap.get('limit'));
    if (this.id == '0') { 
      this.limit= Infinity;
    }

    //this.admobService.showBanner();
    // this.counter = 0;
    //this.showBanner();
  }

  
  
  plus() {
    this.counter++;
    if (this.id != '0') {
      this.updateItem.id = this.id;
      this.updateItem.name = this.folder;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;
  
      this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
    
  }

  minus() {
    this.counter--;
    if (this.id != '0') {
      this.updateItem.id = this.id;
      this.updateItem.name = this.folder;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;

  
      this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
  }

  reset() {
    this.counter=0;
    if (this.id != '0') {
      this.updateItem.id = this.id;
      this.updateItem.name = this.folder;
      this.updateItem.counter = this.counter;
      this.updateItem.limit = this.limit;

  
      this.storageService.updateItem(this.updateItem);
      this.updateItem = <CounterItem>{};
    }
  }

}
