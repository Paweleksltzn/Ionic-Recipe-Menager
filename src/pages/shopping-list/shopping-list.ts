import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController } from 'ionic-angular';
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
    private menuCtrl:MenuController,private popoverCtrl:PopoverController,private authSrv:AuthService) {
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
    const popover = this.popoverCtrl.create(SlOptions);
    popover.present({ev:event});
    popover.onDidDismiss(data=>{
      if(data.action=='store'){
        this.authSrv.getActiveUser().getIdToken().then((token:string)=>{
          this.ingredientSrv.storeList(token).subscribe(response=>{
            console.log(response);
          })
        })
      }
    })
  }

}
