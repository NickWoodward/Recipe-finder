import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear the search input
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clear the search results list
export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
};

/**
 * Iterate over and render a given number of the recipes from the API
 * @param {Array} recipes - The array of recipes from the API
 * @param {number} page - The starting page number
 * @param {number} resultsPerPage - The desired # of results / page 
 */
export const renderResults = ((recipes, page = 1, resultsPerPage = 10) => {
    // Calculate the start and end point of results for pagination
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
});

/** 
 * Limit each recipe title's length
 * @param {string} title - The recipe title
 * @param {number} limit - Length that prevents title spanning 2 lines 
 * @return {string} - The shortened title
 */
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    let total = 0;

    if (title.length > limit) {
        for (let word of title.split(' ')) {
            // If the next word in the array doesn't exceed the limit
            // when added to the total length, push to new title array
            if (word.length + total < limit) {
                newTitle.push(word);
                total += word.length;
            } else {
                break;
            }
        }
        return `${newTitle.join(' ')}...`
    }
    return title;
};

/**
 * Insert HTML for recipe into the search results list
 * @param {Recipe} recipe 
 */
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link" href="${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};