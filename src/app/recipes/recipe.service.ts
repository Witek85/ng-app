import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {

	recipeSelected = new EventEmitter<Recipe>();

	private recipes: Recipe[] = [
	new Recipe('A Test Recipe', 'This is simply a test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Wiener-Schnitzel02.jpg/800px-Wiener-Schnitzel02.jpg'),
	new Recipe('A Test Recipe 2', 'This is simply a test', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/NYC-Diner-Bacon-Cheeseburger.jpg/800px-NYC-Diner-Bacon-Cheeseburger.jpg')
	];

	getRecipes() {
		return this.recipes.slice();
	}
}