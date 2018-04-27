import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { RecipePage } from '../recipe/recipe';

@IonicPage()
@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage{
  recipePage=EditRecipePage;
  recipes:Recipe[];
  unitRecipePage=RecipePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private recipeSrv:RecipesService,private modalCtrl:ModalController,private menuCtrl:MenuController) {
  }
  ionViewWillEnter(){
    this.recipes=this.recipeSrv.getRecipe();
    console.log(this.recipes);
  }
  onNewRecipe(){
    this.navCtrl.push(this.recipePage,{mode:'New'});
  }
  onLoadRecipe(i){
    const modal = this.modalCtrl.create(this.unitRecipePage,{recipe:this.recipes[i]});
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
      if(data.condition){
        this.navCtrl.push(this.recipePage,{mode:'Edit',recipe:this.recipes[i],index:i});
      }
      if(data.delete){
        this.recipes=this.recipeSrv.getRecipe();
      }
    }
    });
    
  }
  onOpenMenu(){
    this.menuCtrl.open();
  }
}
