import { Recipe } from "../interfaces/recipe.interface";
import { Ingredient } from "../interfaces/ingredients.interface";


export class RecipesService{
    recipes:Recipe[]=[];
    
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
}