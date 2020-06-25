import { Component, OnInit } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { StorageService, CounterItem } from './services/storage.service';
import { Router } from '@angular/router';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  newCounter: CounterItem = <CounterItem>{};
  counters: CounterItem[] = [];


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

  error;

  // ca-app-pub-4479311405222115~1301694640
  // ca-app-pub-4479311405222115/9918551261

   bannerConfig: AdMobFreeBannerConfig = {
    id: 'ca-app-pub-4479311405222115/9918551261',
    isTesting: true,
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
  ) {
    this.initializeApp();
    
    
  }

  initializeApp() {
    this.platform.ready().then(() => {

    this.adMobFree.banner.config(this.bannerConfig);
    this.adMobFree.banner.prepare().then(() => {
      // this.adMobFree.banner.show();
    }).catch(e=> { this.error = e})


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

    
  }

  menuOpened() {
    console.log("opened")
    this.adMobFree.banner.hide();
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

    this.storage.addItem(this.newCounter).then(item => {
      this.newCounter = <CounterItem>{};
      this.loadCounters();
    })
  }

  loadCounters() {
    console.log("openedddd");

  //  this.adMobFree.banner.hide();

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