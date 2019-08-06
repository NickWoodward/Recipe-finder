import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultsList.innerHTML = '';
};

export const renderResults = recipes => {
    recipes.forEach(renderRecipe);
};

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    let total = 0;

    if(title.length > limit) {
        for(let word of title.split(' ')) {
            if(word.length + total < limit) {
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