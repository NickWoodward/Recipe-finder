// Global app controller
import "../style.css";
import '../assets/icons.svg';

import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import axios from 'axios';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const searchController = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object & add to state
        state.search = new Search(query);


        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            if (state.search.recipes)
                searchView.renderResults(state.search.recipes);

        } catch (error) {
            console.log(error);
            alert('Something went wrong with the search');
            clearLoader();
        }
    }
    //TODO 'else' render something to say there are no results
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // prevents refresh
    searchController();
});

 
elements.searchResultsPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }

});

/**
 * RECIPE CONTROLLER
 */
const recipeController = async () => {
    // Get the ID from the URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        // Highlight selected search item
        if(state.search)
            searchView.highlightSelected(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);
        try {
            // Get recipe data
            await state.recipe.getRecipe();
 
            state.recipe.parseIngredients();

            clearLoader();

            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            console.log(error);
            alert('Error processing recipe');
        }

    }
};

/**
 * SHOPPING LIST CONTROLLER
 */

const shoppingListController = () => {
    // Create a new list if there isn't one
    if(!state.shoppingList) state.shoppingList = new ShoppingList();

    // Add each ingredient to the list
    state.recipe.parsedIngredients.forEach(ing => {
        const item = state.shoppingList.addItem(state.recipe.servings, ing.qtyPerServing, ing.weightPerServing, ing.quantity, ing.unit, ing.food);
        shoppingListView.renderItem(item);
    });

};


// window.addEventListener('hashchange', recipeController);
// window.addEventListener('load', recipeController);
['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease serving
        state.recipe.updateServings(-1);
        recipeView.clearRecipe();
        recipeView.renderRecipe(state.recipe);

    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase serving
        state.recipe.updateServings(1);
        recipeView.clearRecipe();
        recipeView.renderRecipe(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        shoppingListController();
    }
});

