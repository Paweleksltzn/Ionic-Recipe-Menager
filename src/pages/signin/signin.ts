import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private menuCtrl:MenuController,private authCtrl:AuthService,
  private loadingCtrl:LoadingController,private alertCtrl:AlertController) {
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }
  onSignin(form:NgForm){
    const loading = this.loadingCtrl.create({
      content:'Siging you in'
    });
    loading.present();
    this.authCtrl.signin(form.value.email,form.value.password).then(response=>{
      loading.dismiss();
    }).catch(error=>{
      loading.dismiss();
      const alertCtrl = this.alertCtrl.create({
        title:'Authentication failed',
        message:error.message,
        buttons:['OK']
      });
      alertCtrl.present();
    })
  }
}
