import { LoginPage } from './pages/login/login.page';
import { Component, OnInit } from '@angular/core';

import { Platform, AlertController, ToastController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService, CounterItem } from './services/storage.service';
import { Router } from '@angular/router';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  newCounter: CounterItem = <CounterItem>{};
  counters: CounterItem[] = [];

  loggedIn: boolean;

  public selectedIndex = 0;
  public selectedIndexYour = 0;
  
  public appPages = [
    {
      title: 'Standard',
      url: '/folder/standard/0/0/0',
      counter: 0,
      id: null,
      limit: null,
    },
    
  ];

   bannerConfig: AdMobFreeBannerConfig = {
    id: 'ca-app-pub-4479311405222115/3044213231',
    isTesting: false,
    autoShow: true,
    size: 'BANNER',
  }
  
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    private alertController: AlertController,
    private router: Router,
    private toastCtrl: ToastController,
    private adMobFree: AdMobFree,

    private afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private db: AngularFirestore
  ) {
    this.initializeApp();
    
    
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.afAuth.authState.subscribe((user) => {
        if(!user) {
          this.loggedIn = false;
          this.router.navigateByUrl('login')
        } else {
          this.loggedIn = true;

          this.router.navigateByUrl('/folder/standard/0/0/0');
        }
      })

      this.adMobFree.banner.config(this.bannerConfig);
      this.adMobFree.banner.prepare().then(() => {


    }).catch(e=> console.log(e))


      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.storage.initializeDb();
      this.loadCounters();

    });
  }

  ngOnInit() {

    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    this.afAuth.authState.subscribe((user) => {
      if(!user) {
        return;

      } else {

      console.log(user);

     // this.db.collection(`users/${user}/counters`).snapshotChanges().subscribe((colSnap) => {
    

        // this.appPages = [
        //   {
        //     title: 'Standard',
        //     url: '/folder/standard/0/0/0',
        //     counter: 0,
        //     id: null,
        //     limit: null,
        //   },
          
        // ];
        // if(colSnap) {
        //   colSnap.forEach((item) => {

        //     let counter: any = item.payload.doc.data();

        //     this.appPages.push(
        //       {
        //         title: counter.name,
        //         url: '/folder/'+counter.name+'/'+counter.counter+'/'+counter.id+'/'+counter.limit, 
        //         counter: counter.counter,
        //         id: counter.id,  
        //         limit: counter.limit,
        //       }
        //   )
        // })
        // }
  //  });  
  }
    });

  
    
  }

  menuOpened() {
    console.log("opened")
    //this.adMobFree.banner.hide();
  }

  menuClose() {
    console.log("closed")

    this.adMobFree.banner.show();

  }
  
  async addCounter() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add new counter',
      subHeader: 'Write name, starting point and limit number',
      inputs: [
        {
          name: 'name',
          type: 'text',
          label: 'name',
          placeholder: 'Counter name'
        },
        
        {
          label: 'counter',
          name: 'counter',
          type: 'number',
          placeholder: 'Starting number',
        },

        {
          label: 'limit',
          name: 'limit',
          type: 'number',
          placeholder: 'Limit number'

          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Add',
          handler: (val) => {

           if(!val.counter) {
              this.showErrorToast('You should provide a starting point');
              return false;
            } else if(!val.limit) {
              this.showErrorToast('You should provide a limit point');
              return false;
            } else if (val.counter > val.limit) {
              this.showErrorToast('The starting point should be smaller than the limit number');
              return false;
            } else {
              this.handleAddItem(val.name, val.counter, val.limit)
              return true;
            }
          }

           
          
        }
      ]
    });

    await alert.present();
  }

  

  handleAddItem(name: string, counter: number, limit: number) {
    if (!name.trim().length)
      return;

    let now = new Date().getTime();

   
    // this.newItem.id = Date.now().toString();
    this.newCounter.counter = counter;
    this.newCounter.id = now.toString();
    this.newCounter.name = name;
    this.newCounter.limit = limit;

    this.db.collection(`users/${this.afAuth.currentUser}/counters`).add({
      id: this.newCounter.id,
      counter: counter,
      name: name,
      limit: limit,
    })

    this.storage.addItem(this.newCounter).then(item => {
      this.newCounter = <CounterItem>{};
      this.loadCounters();
    })
  }

  loadCounters() {
    console.log("openedddd");

    this.adMobFree.banner.hide();

    this.storage.getItems().then((items: CounterItem[]) => {
      this.appPages = [
        {
          title: 'Standard',
          url: '/folder/standard/0/0/0',
          counter: 0,
          id: null,
          limit: null,
        },
        
      ];
      if(items) {
        items.forEach((item) => {
          this.appPages.push(
            {
              title: item.name,
              url: '/folder/'+item.name+'/'+item.counter+'/'+item.id+'/'+item.limit, 
              counter: item.counter,
              id: item.id,  
              limit: item.limit,
            }
        )
      })
      }
      
  });
}

async delete(id: string) {

  this.storage.deleteItem(id).then(async () => {
    //this.showToast('Item removed');
    this.loadCounters();
    this.router.navigateByUrl(`/folder/standard/0/0/0`);

    const toast = await this.toastCtrl.create({
      message: 'Counter deleted',
      duration: 2000
    });
    toast.present();

  });

}

async showErrorToast(data: any) {
  let toast = await this.toastCtrl.create({
    message: data,
    duration: 5000,
    position: 'bottom'
  });

  toast.present();
}


}