import { Recipe } from "../interfaces/recipe.interface";
import { Ingredient } from "../interfaces/ingredients.interface";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth";
import { Injectable } from "@angular/core";

@Injectable()
export class RecipesService{
    recipes:Recipe[]=[];
    
    constructor(private http:HttpClient,private authSrv:AuthService){}
    addRecipe(name:string,description:string,difficulty:string,ingredients:Ingredient[]){
        this.recipes.push(new Recipe(name,description,difficulty,ingredients));
        console.log(this.recipes);
    }
    getRecipe(){
        return this.recipes.slice();
    }
    updateRecipe(index,recipe:Recipe){
        this.recipes[index]=recipe;
    }
    deleteRecipe(i){
        this.recipes.splice(i,1);
    }
    setRecipes(recipes:Recipe[]){
        this.recipes=recipes;
    }
    storeRecipes(token){
        const userId=this.authSrv.getActiveUser().uid;
        return this.http.put('https://ionic2-95189.firebaseio.com/'+userId+'/recipes.json?auth='+token,this.recipes);
    }
    fetchRecipes(token){
        const userId=this.authSrv.getActiveUser().uid;
        return this.http.get('https://ionic2-95189.firebaseio.com/'+userId+'/recipes.json?auth='+token);
    }
    
}