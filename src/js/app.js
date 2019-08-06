// Global app controller
import "../style.css";
import '../assets/icons.svg';

import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import axios from 'axios';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

const search = async () => {
    // 1) Get query from view
    const query = searchView.getInput();
    console.log(query);

    if(query) {
        // 2) New search object & add to state
        state.search = new Search(query);
    }

    // 3) Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResults);

    // 4) Search for recipes
    await state.search.getResults();

    // 5) Render results on UI
    console.log(state.search.recipes);
    clearLoader();
    searchView.renderResults(state.search.recipes);
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault(); // prevents refresh
    search();
});

