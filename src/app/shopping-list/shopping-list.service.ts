// import { EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs/Subject';

export class ShoppingListService {

	ingredientsChange = new Subject<Ingredient[]>();

	private ingredients: Ingredient[] = [
	new Ingredient('Apples', 5),
	new Ingredient('Tomatoes', 10),
	];

	getIngredients() {
		return this.ingredients.slice();
	}

	addIngredient(ingredient: Ingredient) {
		this.ingredients.push(ingredient);
		this.ingredientsChange.next(this.ingredients.slice());
		// this.ingredientsChange.emit(this.ingredients.slice());
	}

	addIngredients(ingredients: Ingredient[]) {
		this.ingredients.push(...ingredients);
		this.ingredientsChange.next(this.ingredients.slice());
		// this.ingredientsChange.emit(this.ingredients.slice());
	}


}