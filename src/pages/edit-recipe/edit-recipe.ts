import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { RecipesService } from '../../services/recipes.service';
import { Recipe } from '../../interfaces/recipe.interface';

@IonicPage()
@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit{
  mode:string='New';
  options=['Easy','Medium','Hard'];
  form:FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private actionSheetCtrl:ActionSheetController,private aletrCtrl:AlertController,
    private toastCtrl:ToastController, private recipeSrv:RecipesService
  ) {
  }
  ngOnInit(){
    this.mode=this.navParams.get('mode');
    this.initializeForm();
    if(this.mode=='Edit'){
      const recipe = this.navParams.get('recipe');
      this.form.patchValue({
        title:recipe.title,
        difficulty:recipe.difficulty,
        description:recipe.description
      });
      for(let ing of recipe.ingredients){
        (<FormArray>this.form.get('ingredients')).push(new FormControl(ing.name,Validators.required));
      }
    }
  }
  private initializeForm(){
    this.form=new FormGroup({
      'title' : new FormControl(null,Validators.required),
      'description' : new FormControl(null,Validators.required),
      'difficulty' : new FormControl('Medium',Validators.required),
      'ingredients': new FormArray([])
    });
  }
  private createNewIngredientAlert(){
    const newIngredientAlert = this.aletrCtrl.create({
      title:'Add Ingredient',
      inputs:[
        {
          name:'name',
          placeholder:'name'
        }
      ],
        buttons:[{
          text:'cancel',
          role:'cancel'
        },{
          text:'Add',
          handler:(data)=>{
            if(data.name.trim() =='' || data.name == null){
              const toast = this.toastCtrl.create({
                message:'Please enter a valid value',
                duration: 2000
              });
              toast.present();
              return;
            }
            (<FormArray>this.form.get('ingredients')).push(new FormControl(data.name,
            Validators.required
            ));
            const toast = this.toastCtrl.create({
              message:'Ingredient Added',
              duration: 2000
            });
            toast.present();
          }

        }]
    });
    return newIngredientAlert;
  }
  onManageIngredients(){
   const actionSheet = this.actionSheetCtrl.create({
     title:'What do you want to do?',
     buttons:[
       {
       text:'Add ingredient',
       handler: ()=>{
        this.createNewIngredientAlert().present();
       }
     },
     {
      text:'Remove all ingredients',
      role:'destructive',
      handler: ()=>{
        const fArray:FormArray= <FormArray>this.form.get('ingredients');
        const len = fArray.length;
        if(len>0){
          for(let i=len-1;i>=0;i--){
            fArray.removeAt(i);
          }
          const toast = this.toastCtrl.create({
            message:'All ingredients were deleted',
            duration: 2000
          });
          toast.present();
        }
      }
      },
      {
        text:'Cancel',
        role: 'cancel',
      }
    ]
   });
   actionSheet.present();
  }
  getControlName(){
    return (<FormArray>this.form.get('ingredients')).controls;
  }
  onSubmit(){
  
    const values = this.form.value;
    let ingredients = [];
    if(values.ingredients.length>0){
      ingredients = values.ingredients.map(ingredient=>{
      return {name:ingredient,amount:1}
    });
  }
  if(this.mode=='New'){
    this.recipeSrv.addRecipe(values.title,values.description,values.difficulty,ingredients);
  }else{
    const index = this.navParams.get('index');
    this.recipeSrv.updateRecipe(index,new Recipe(values.title,values.description,values.difficulty,ingredients))
  }
    this.navCtrl.popToRoot();
  }
}
