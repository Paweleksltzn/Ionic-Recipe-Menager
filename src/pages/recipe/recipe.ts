import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Recipe } from '../../interfaces/recipe.interface';
import { RecipesService } from '../../services/recipes.service';
import { IngredientsService } from '../../services/ingredients.service';
import { ShoppingListPage } from '../shopping-list/shopping-list';

@IonicPage()
@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit{
  recipe:Recipe;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController,
    private recipeSrv:RecipesService,private ingredientSrv:IngredientsService) {
  }
  ngOnInit(){
    this.recipe=this.navParams.get('recipe');
  }
  onRecall(condition=false){
    let i = this.navParams.get('index');
    this.viewCtrl.dismiss({recipe:this.recipe,condition:condition,index:i});
  }
  onDelete(){
    let i = this.navParams.get('index');
    this.recipeSrv.deleteRecipe(i);
    this.viewCtrl.dismiss({delete:true});
  }
  onAddIngredients(){
   this.ingredientSrv.onAddIngredients(this.recipe.ingredients);
   this.navCtrl.setRoot(ShoppingListPage);
  }
}
