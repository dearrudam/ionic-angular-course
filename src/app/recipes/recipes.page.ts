import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {

  recipes: Recipe[];
  private recipesSubscription: Subscription;

  constructor(private recipesService: RecipesService) { }

  ngOnInit() {
    this.recipesSubscription = this.recipesService.subscribe(recipes => this.recipes = recipes);
  }

  ngOnDestroy() {
    this.recipesSubscription.unsubscribe();
  }

}
