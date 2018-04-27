import { Ingredient } from "../interfaces/ingredients.interface";
import { AuthService } from "./auth";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
@Injectable()
export class IngredientsService{
    private ingredients:Ingredient[]=[];
    editItemIndex:number;
    constructor(private http:HttpClient,private authSrv:AuthService){
        
    }
    onAddIngredient(ingredients:Ingredient){
        this.ingredients.push(ingredients);
        console.log(this.ingredients);
    }
    getIngredients():Ingredient[]{
       return this.ingredients.slice();
    }
    onAddIngredients(ingredients:Ingredient[]){
        this.ingredients.push(...ingredients);
    }
    removeItem(index:number){
        this.ingredients.splice(index,1);
    }
    editItem(i:number){
        this.editItemIndex=i;
    }
    getEditNumber():number{
        return this.editItemIndex;
    }
    patchIngredients(ingredient,index){
        this.ingredients[index]=ingredient;
    }
    patchIngredientsViaHttp(ingredients:Ingredient[]){
        this.ingredients=ingredients;
    }
    storeList(token:string){
        const userId=this.authSrv.getActiveUser().uid;
        return this.http.put('https://ionic2-95189.firebaseio.com/'+userId+'shooping-list.json?auth='+token,this.ingredients);
      }
    fetchList(token){
        const userId=this.authSrv.getActiveUser().uid;
        return this.http.get('https://ionic2-95189.firebaseio.com/'+userId+'shooping-list.json?auth='+token);
    }
}