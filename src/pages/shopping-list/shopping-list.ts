import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { IngredientsService } from '../../services/ingredients.service';
import { Ingredient } from '../../interfaces/ingredients.interface';
import { SlOptions } from './sl-options.ts/sl-options';
import { AuthService } from '../../services/auth';


@IonicPage()
@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage{
  ingredients:Ingredient[]=[];
  editMode=false;
  @ViewChild('form')form:NgForm
  constructor(public navCtrl: NavController, public navParams: NavParams,private ingredientSrv:IngredientsService,
    private menuCtrl:MenuController,private popoverCtrl:PopoverController,private authSrv:AuthService,private loadingCtrL:LoadingController,
  private alertCtrl:AlertController) {
  }
  ionViewWillEnter(){
    this.ingredients=this.ingredientSrv.getIngredients();
  }
  onSubmit(){
    const ingredient:Ingredient={name:this.form.value.ingredientName,amount:this.form.value.amount};
    if(!this.editMode){
    this.ingredientSrv.onAddIngredient(ingredient);
    this.form.reset();
    this.ingredients=this.ingredientSrv.getIngredients();
    }
    else {
      let index = this.ingredientSrv.getEditNumber();
      this.ingredients[index]=ingredient;
      this.ingredientSrv.patchIngredients(ingredient,index);
      this.editMode=false;
      this.form.reset();
    }
  }
  removeItem(i:number){
    this.ingredientSrv.removeItem(i);
    this.ingredients=this.ingredientSrv.getIngredients();
  }
  editItem(ingredient:Ingredient,i:number){
    this.form.setValue({
      ingredientName:ingredient.name,
      amount:ingredient.amount
    });
    this.editMode=true;
    this.ingredientSrv.editItem(i);
  }
  ionViewWillLeave(){
    this.editMode=false;
    this.form.reset();
  }
  onOpenMenu(){
    this.menuCtrl.open();
  }
  onShowOptions(event){
    const loading = this.loadingCtrL.create({
      content:'Please wait'
    })
    const popover = this.popoverCtrl.create(SlOptions);
    popover.present({ev:event});
    popover.onDidDismiss(data=>{
      if(!data){
        return;
      }
      if(data.action=='store'){
        loading.present();
        this.authSrv.getActiveUser().getIdToken().then((token:string)=>{
          this.ingredientSrv.storeList(token).subscribe(response=>{
            loading.dismiss();
          },error=>{
            loading.dismiss();
            this.alertAppear().present();
          })
        })
      }
      else if(data.action=='load'){
        loading.present();
        this.authSrv.getActiveUser().getIdToken().then((token:string)=>{
          this.ingredientSrv.fetchList(token).subscribe(response=>{
            if(!response){
              response=[];
            }
            this.ingredients=response;
            this.ingredientSrv.patchIngredientsViaHttp(response) || [];
            loading.dismiss();
          },error=>{
            loading.dismiss();
            this.alertAppear().present();
          })
        })
      }
    })
  }
  private alertAppear(){
    return this.alertCtrl.create({
      title:'Something goes wrong',
      message:'Http request didn t success',
      buttons:['OK']
    })
  }

}
