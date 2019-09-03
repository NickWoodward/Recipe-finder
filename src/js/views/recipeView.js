import { elements } from './base';
import Fraction from 'fraction.js';

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

export const renderRecipe = recipe => {

    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
            </figure>
            <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="#icons_icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${`Test: 45`}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="#icons_icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>
                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="#icons_icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="#icons_icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="#icons_icon-heart-outlined"></use>
                </svg>
            </button>
            </div>
            <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.parsedIngredients.map(el => createIngredient(el)).join('')}

            </ul>
            <button class="btn-small recipe__btn">
                <svg class="search__icon">
                    <use href="#icons_icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
            </div>
            <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="#icons_icon-triangle-right"></use>
                </svg>
            </a>
        </div>`
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

const createIngredient = (ingredient, index) => {    
    return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="#icons_icon-check"></use>
        </svg>
        <div class="recipe__ingredient">${parseIngredient(ingredient)}</div>
    </li>  
`
};

/**
 * Create the string to be displayed based on the data available
 * 
 * 
 */
const parseIngredient = ingredient => {
    // Shallow copy of ingredient to preserve original
    const result = {...ingredient};

    // Make all units and food types lower case
    result.unit = result.unit.toLowerCase();
    result.food = result.food.toLowerCase();

    // Parse measurements to take plurals and language edge cases into account
    result.unit = parseMeasurement(result.quantity, result.unit);

    // Format numbers: .1 dp for weight, into {Fraction} for quantity
    if (result.quantity) result.quantity = formatNum(result.quantity, 'qty');
    if (result.weight) result.weight = formatNum(result.weight, 'weight');

    /**
     * - 'qty-unit': Display the quantity of the food, plus the unit provided by the API
     * - 'food-unit': Display the quantity, food type itself as it is the unit of measurement, and weight. 
     * - 'food-weight': Display the food type and weight. Differs from food-unit in that there's no quantity available either.
     * - 'to-taste': No quantity or weight info provided.
     **/
    switch (result.displayType) {
        case 'qty-unit': return `${result.quantity} ${result.unit} of ${result.food}`;
        //NB: Wrong?
        case 'food-unit': return `${result.quantity} ${result.unit} (${result.weight}g)`; // deal with formatting probs here
        case 'to-taste': return `${capitalise(result.food)} (To taste)`;
        case 'food-weight': return `${capitalise(result.food)} (${result.weight}g)`;
        default: console.log('Unknown');
    }
};

const parseMeasurement = (quantity, measurement) => {

    // Ignore <unit> as a measurement
    if (measurement === '<unit>' || !quantity) return measurement;
    // If the quantity is > 1 and doesn't already end with an 's', make the measurement plural
    else if ((quantity > 1) && measurement.charAt(measurement.length - 1) !== 's') {
        // Add unusual cases here
        switch (measurement) {
            case 'leaf': return 'leaves';
            default: return `${measurement}s`;
        }
        // If the quantity is .5: Eg: 1/2 a cup
    } else if (quantity === 0.5) {
        return `a ${measurement}`;
        // If the quantity < 1: Eg: 1/3 of a cup
    } else if (quantity < 1) {
        return `of a ${measurement}`;
    } else {
        return measurement;
    }
}

const formatNum = (num, type) => {
    // If type is a weight, use toFixed to .1
    // If type is quantity, use the fraction.js package
    if (type === 'weight') {
        num = parseInt(num).toFixed(1);
        // Remove the decimal if it's 0 
        // 428.0 > 4280 > 0 > 0 === true
        // 428.1 > 4281 > 1 > .1 === false
        if (num * 10 % 10 / 10 === 0) {
            return parseInt(num).toFixed(0);
        } else {
            return parseInt(num, 10);
        }
    } else if (type == 'qty') {
        const fraction = new Fraction(num).simplify(0.001);
        return fraction.toFraction(true);
    }
    return parseInt(num, 10);
};

const capitalise = word => {
    if(word)
        return word.charAt(0).toUpperCase() + word.slice(1);
};



