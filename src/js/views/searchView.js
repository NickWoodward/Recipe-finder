import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Clear the search input
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clear the search results list
export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
};

export const highlightSelected = id => {
    const results = Array.from(document.querySelectorAll('.results__link'));
    results.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

/**
 * Iterate over and render a given number of the recipes from the API
 * @param {Array} recipes - The array of recipes from the API
 * @param {number} page - The starting page number
 * @param {number} resultsPerPage - The desired # of results / page 
 */
export const renderResults = ((recipes, page = 1, resultsPerPage = 5) => {
    // Calculate the start and end point of results for pagination
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    renderResultsBtns(page, recipes.length, resultsPerPage);
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
    // Split the recipeURI to get the unique ID
    const recipeID = recipe.uri.split('#')[1];
    const markup = `
        <li>
            <a class="results__link results__link" href="#${recipeID}">
                <figure class="results__fig">
                    <img src="${recipe.image}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.label)}</h4>
                    <p class="results__author">${recipe.source}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultsList.insertAdjacentHTML('beforeend', markup);
};

/**
 * Display different pagination buttons for different pages/number of results
 * @param {number} page - The current page.
 * @param {number} numResults - The number of recipes.
 * @param {number} resultsPerPage - The number of recipes per result page.
 */
const renderResultsBtns = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults / resultsPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Button to go to next page
        button = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // Button to go to last page
        button = createButton(page, 'prev');
    } else if(page < pages) {
        // Both buttons as a template string
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    if (button) elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

/**
 * Create a button to be displayed on the search results element
 * @param {number} page - The number of the page we're currently on
 * @param {string} type - Of type 'prev' or 'next' 
 */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="#icons_icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;