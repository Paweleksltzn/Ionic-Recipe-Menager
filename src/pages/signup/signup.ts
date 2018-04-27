import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private menuCtrl:MenuController,
  private authSrv:AuthService,private loadingCtrl:LoadingController,private alertCtrl:AlertController) {
  }

  onOpenMenu(){
    this.menuCtrl.open();
  }
  onSignup(form:NgForm){
    const loading=this.loadingCtrl.create({
      content:'Signing you up'
    });
    loading.present();
    const email = form.value.email;
    const password = form.value.password;
    this.authSrv.signup(email,password).then(response=>{
      loading.dismiss();
    }).catch(error=>{
      loading.dismiss();
      const alert=this.alertCtrl.create({
        title:'Signup failed!',
        message:error.message,
        buttons:['OK']
      });
      alert.present();
    });
  }
}
