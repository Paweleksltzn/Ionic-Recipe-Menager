import { Component, ViewChild } from '@angular/core';
import { Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  registerPage=SignupPage;
  logInPage=SigninPage;
  isAuthenticated:boolean;
  @ViewChild('myContent') myContent;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private authSrv:AuthService) {
    firebase.initializeApp({
      apiKey: "AIzaSyAiD54jbnTT3O3i7iRm4KsX7fJAOv6MDyI",
      authDomain: "ionic2-95189.firebaseapp.com",
    });
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        this.isAuthenticated=true;
        this.setRootPage(this.rootPage);
      }else{
        this.isAuthenticated=false;
        this.setRootPage(this.logInPage);
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  setRootPage(page){
    this.myContent.setRoot(page);
  }
  logOut(){
    this.authSrv.logOut();
  }
}

