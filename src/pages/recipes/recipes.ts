import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, MenuController, PopoverController, LoadingController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../interfaces/recipe.interface';
import { RecipePage } from '../recipe/recipe';
import { AuthService } from '../../services/auth';
import { SlOptions } from '../shopping-list/sl-options.ts/sl-options';

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
    private recipeSrv:RecipesService,private modalCtrl:ModalController,private menuCtrl:MenuController,private authSrv:AuthService,
  private popoverCtrl:PopoverController,private loadingCtrl:LoadingController) {
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
  onShowOptions(event){
    const loading = this.loadingCtrl.create({
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
          this.recipeSrv.storeRecipes(token).subscribe(response=>{
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
          this.recipeSrv.fetchRecipes(token).subscribe(response=>{
            if(!response){
              response=[];
            }
            for(let resp of response){
              if (!resp.ingredients){
                resp.ingredients=[];
              }
            }
            this.recipes=response;
            this.recipeSrv.setRecipes(response) || [];
            loading.dismiss();
          },error=>{
            loading.dismiss();
            this.recipeSrv().present();
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
