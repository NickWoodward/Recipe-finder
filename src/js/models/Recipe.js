import axios from 'axios';
import Fraction from 'fraction.js';

export default class Recipe {
    constructor(uri) {
        this.uri = uri;
    }

    async getRecipe() {
        try {
            const recipeID = encodeURIComponent(`${process.env.EDAMAM_RECIPE_URL}${this.uri}`);
            const result = await axios(`${process.env.EDAMAM_URL}?app_key=${process.env.EDAMAM_KEY}&app_id=${process.env.EDAMAM_ID}&r=${recipeID}`);
            console.log(result);
            this.title = result.data[0].label;
            this.food = result.data[0].food;
            this.author = result.data[0].source;
            this.img = result.data[0].image;
            this.url = result.data[0].url;
            this.ingredients = result.data[0].ingredients;
            this.servings = result.data[0].yield;

        } catch (err) {
            console.log(err);
            alert('Something went wrong');
        }
    }

    // updateServings(type){
    //     // Servings
    //     const newServings = type ==='dec'? this.servings-- : this.servings++;
    //     // Ingredients

    //     this.servings = newServings;
    // }
    viewParsedIngredients() {
        console.log(this.parsedIngredients);
    }

    // Parse ingredients
    parseIngredients() {
        const newIngredients = this.ingredients.map((ingredient, index) => {
            let result = {
                food: ingredient.food,
                text: ingredient.text,
                weight: ingredient.weight,
                quantity: ingredient.quantity,
                // Amount will be either weight or quantity depending on the structure of the item
                amount: 0,
                // Unit will be the measurement or food type depending on the item
                unit: ''
            };

            // Unit options:
            // 1: Quantity + Unit (Excluding 'gram')
            // 2: Quantity + Food Type (No unit available)
            // 3: Food Type + Weight
            // 4: Ouput 'to taste'

            // Food types that shouldn't be used structured as 'qty + food type' if a unit doesn't exist 
            // eg: '1 black pepper', '1 dark chocolate'
            // use weight 
            const exceptions = ['egg', 'black pepper', 'yellow cake'];

            // Check quantity available
            if (ingredient.quantity && ingredient.measure.toLowerCase() !== "gram") {
                result.amount = ingredient.quantity;
                // Check unit available
                if (ingredient.measure !== "<unit>") {
                    // 1: Quantity + Unit
                    result.unit = ingredient.measure;
                    // 2:  Quantity + Food type
                } else {
                    // Food should only be used as the unit if quantity isn't '1'.
                    // Eg: Black pepper and chocolate often have a measure of <unit> and quantity of 1,
                    // but '1 black pepper' and '1 chocolate' don't make sense. 
                    // Egg is the exception here
                    if(ingredient.quantity === 1 && !exceptions.some(exception => ingredient.food.includes(exception)))
                        result.unit = ingredient.food;
                } 
            // 4: If no available units
            } else if(!ingredient.quantity && !ingredient.weight) {
                result.unit = 'to taste'
            } else {
                // 3: Food Type plus Weight
                result.amount = ingredient.weight;
                result.unit = ingredient.food;
            }

            console.log(index, result.amount, result.unit);

            // Edit for plurals and language edge cases
            ingredient.measure = this.parseMeasurement(ingredient.quantity, ingredient.measure);

            // Ideally use the quantity plus the unit of measurement, but if ingredient.measure is gram use ingredient.weight instead
            // If there's no unit of measurement but there is a quantity, use ingredient.quantity + ingredient.food 
            if (ingredient.quantity && ingredient.measure !== "gram") {
                // NB: a quantity of '1' with a <unit> type is usually suspect (1 black pepper, 1 milk chocolate etc), add gram weight + food type
                // 'Egg' is an exception (1 egg), and black pepper has to be added as an additional exception as the quantity can be the number of pinches
                // 
                if (ingredient.measure === "<unit>") {
                    result.description = ((ingredient.quantity === 1 && ingredient.food.toLowerCase() !== 'egg') || ingredient.food.indexOf('black pepper') > -1) ?
                        `${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)` : `${this.formatNum(ingredient.quantity, 'qty')} ${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)`;
                }
                // Else use quantity + the parsed unit
                else {
                    result.description = `${this.formatNum(ingredient.quantity, 'qty')} ${ingredient.measure} of ${ingredient.food}`;
                }
            }
            // If there's no quantity or weight, use 'to taste'
            else if (!ingredient.quantity && !ingredient.weight) {
                result.description = `to taste`
            }
            // Else just use the gram weight
            else {
                result.description = `${ingredient.food} (${this.formatNum(ingredient.weight, 'weight')}g)`
            }
            return result;
        });

        this.parsedIngredients = newIngredients;
    }

    parseMeasurement(quantity, measurement) {
        // Ignore <unit> as a measurement
        if (measurement === '<unit>') return measurement;
        // If the quantity is > 1, make the measurement plural
        else if (quantity > 1) {
            // Add unusual cases here
            switch (measurement) {
                case 'leaf': return 'leaves';
                default: return `${measurement}s`;
            }
            // If it's < 1 then add 'a' for '1/2 a unit of'
            // or 'of a' for anything else. Eg '1/4 of a unit of'
        } else if (quantity < 1) {
            switch (quantity) {
                case 0.5: return `a ${measurement}`;
                default: return `of a ${measurement}`
            }

        } else {
            return measurement;
        }
    }

    // 
    formatNum(num, type) {
        // If type is a weight, use toFixed to .1
        // If type is quantity, use the fraction.js package
        if (type === 'weight') {
            num = num.toFixed(1);
            // Remove the decimal if it's 0 
            // 428.0 > 4280 > 0 > 0 === true
            // 428.1 > 4281 > 1 > .1 === false
            if (num * 10 % 10 / 10 === 0) return parseInt(num).toFixed(0);
            return num;
        } else if (type == 'qty') {
            const fraction = new Fraction(num).simplify(0.001);
            return fraction.toFraction(true);
        }
        return num;
    }

}