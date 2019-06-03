import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private recipes: Recipe[] = [
    {
      id: 'r0',
      title: 'Feijoada',
      imageUrl: 'http://www.portalatual.com.br/wp-content/uploads/2018/06/bolinha-3-jpeg-800x445.jpg',
      ingredients: [
        'Black beans',
        'Olive oil',
        'Pork shoulder',
        'Onions',
        'Garlic',
        'Peeled',
        'Chopped',
        'Corned beef',
        'Fresh sausages',
        'Smoked sausage',
        'Smoked ham hock or shank',
        'Bay leaves',
        'Water',
        'Crushed tomatoes',
        'Salt'
      ]
    },
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Schnitzel.JPG/1024px-Schnitzel.JPG',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg/1024px-Spaghetti_Bolognese_mit_Parmesan_oder_Grana_Padano.jpg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];

  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {
      ...this.recipes.find(recipe => {
        return recipe.id === recipeId;
      })
    };
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => {
      return recipe.id !== recipeId;
    });
  }

}
