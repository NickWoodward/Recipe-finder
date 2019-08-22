// Global app controller
import "../style.css";
import '../assets/icons.svg';

import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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
            // state.recipe.viewParsedIngredients();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error processing recipe');
        }

    }
}


// window.addEventListener('hashchange', recipeController);
// window.addEventListener('load', recipeController);
['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController));