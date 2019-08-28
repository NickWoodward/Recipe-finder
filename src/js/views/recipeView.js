import { elements } from './base';

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
                    <button class="btn-tiny">
                        <svg>
                            <use href="#icons_icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny">
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

const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="#icons_icon-check"></use>
        </svg>
        <div class="recipe__ingredient">${parseIngredient(ingredient)}</div>
    </li>  
`;

/**
 * Create the string to be displayed based on the data available
 * 
 * 
 */
const parseIngredient = ingredient => {
    if(!ingredient.weightFlag) return `${ingredient.quantity} ${ingredient.unit} of ${ingredient.food}`;
    else if(ingredient.quantity) return `${ingredient.quantity} of ${ingredient.food} (${ingredient.weight}g)`;
    else return `${ingredient.food} (${ingredient.weight}g)`

};
            // // Edit for plurals and language edge cases
            // // Order matters, parseMeasurement logic relies on a number, formatNum can return { Fraction }
            // result.unit = this.parseMeasurement(result.quantity, result.unit);
            // result.quantity = this.formatNum(result.quantity, 'qty');
            // result.weight = this.formatNum(result.weight, 'weight');

// parseMeasurement(quantity, measurement) {
//     // Ignore <unit> as a measurement
//     if (measurement === '<unit>' || !quantity) return measurement;
//     // If the quantity is > 1, make the measurement plural
//     else if (quantity > 1) {
//         // Add unusual cases here
//         switch (measurement) {
//             case 'leaf': return 'leaves';
//             default: return `${measurement}s`;
//         }
//     } else {
//         return measurement;
//     }
// }

// // 
// formatNum(num, type) {
//     // If type is a weight, use toFixed to .1
//     // If type is quantity, use the fraction.js package
//     if (type === 'weight') {
//         num = num.toFixed(1);
//         // Remove the decimal if it's 0 
//         // 428.0 > 4280 > 0 > 0 === true
//         // 428.1 > 4281 > 1 > .1 === false
//         if (num * 10 % 10 / 10 === 0) return parseInt(num).toFixed(0);
//         return parseInt(num, 10);
//     } else if (type == 'qty') {
//         const fraction = new Fraction(num).simplify(0.001);
//         return fraction.toFraction(true);
//     }
//     return parseInt(num, 10);
// }


            // // Ideally use the quantity plus the unit of measurement, but if ingredient.measure is gram use ingredient.weight instead
            // // If there's no unit of measurement but there is a quantity, use ingredient.quantity + ingredient.food 
            // if (ingredient.quantity && ingredient.measure !== "gram") {
            //     // NB: a quantity of '1' with a <unit> type is usually suspect (1 black pepper, 1 milk chocolate etc), add gram weight + food type
            //     // 'Egg' is an exception (1 egg), and black pepper has to be added as an additional exception as the quantity can be the number of pinches
            //     // 
            //     if (ingredient.measure === "<unit>") {
            //         result.description = ((ingredient.quantity === 1 && ingredient.food.toLowerCase() !== 'egg') || ingredient.food.indexOf('black pepper') > -1) ?
            //             `${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)` : `${this.formatNum(ingredient.quantity, 'qty')} ${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)`;
            //     }
            //     // Else use quantity + the parsed unit
            //     else {
            //         result.description = `${this.formatNum(ingredient.quantity, 'qty')} ${ingredient.measure} of ${ingredient.food}`;
            //     }
            // }
            // // If there's no quantity or weight, use 'to taste'
            // else if (!ingredient.quantity && !ingredient.weight) {
            //     result.description = `to taste`
            // }
            // // Else just use the gram weight
            // else {
            //     result.description = `${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)`
            // }
