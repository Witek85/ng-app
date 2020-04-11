import { NgModule } from '@angular/core';

import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { DataStorageService } from './shared/data-storage.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard';

@NgModule({
  providers: [
    ShoppingListService, 
    RecipeService, 
    DataStorageService, 
    AuthService, 
    AuthGuard
  ],
})
export class CoreModule { }
