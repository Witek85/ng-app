import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from 'app/auth/auth.service';

@Injectable()
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://ng-course-recipe-book-e6d5e.firebaseio.com/recipes.json', recipes).subscribe(response => {
      console.log(response)
    });
  }

  fetchRecipes() {
    // TODO powinno być jako exhaustMap
    let token = this.authService.user.getValue().token;
    this.http
    .get<Recipe[]>('https://ng-course-recipe-book-e6d5e.firebaseio.com/recipes.json', {
      params: new HttpParams().set('auth', token)
    }) 
    .subscribe(recipes => {
      this.recipeService.setRecipes(recipes);
    });
    

  }

}
