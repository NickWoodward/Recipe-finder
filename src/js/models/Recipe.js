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
                // Unit will be ingredient.measurement or ingredient.food type depending on the item and if quantity is available
                unit: '',
                // Weight flag shows need to add extra specificity to the quantity and food type (eg: 2 chorizos => 2 chorizos (120g))
                weightFlag: false
            };

            // Structure options:
            // 1: Quantity + Unit (Excluding 'gram')
            // 2: Quantity + Food Type (No unit available)
            // 3: Quantity + Food Type + Weight (Needed more specificity, eg: 2 chorizos (120g)) // Use weightFlag
            // 4: Food Type + Weight // Use weightFlag
            // 5: Ouput 'to taste'

            // Reset the quantity to '0' and set the weightFlag if there's no measurement & it's something that shouldn't have a quantity
            // Eg: 1 black pepper, 1 yellow cake, 1 dark chocolate etc don't make sense
            const exceptions = ['black pepper', 'yellow cake', 'chocolate'];
            if((!ingredient.measure || ingredient.measure === '<unit>') && exceptions.includes(ingredient.food)) {
                ingredient.quantity = 0;
                result.quantity = 0;
                result.weightFlag = true;
            }

            // Check quantity available
            if (ingredient.quantity && ingredient.measure.toLowerCase() !== "gram") {
                // Check unit available
                if (ingredient.measure !== "<unit>") {
                    // 1: Quantity + Unit
                    result.unit = ingredient.measure;
                // 2:  Quantity + Food type
                } else {
                    // Some 
                    result.unit = ingredient.food;
                    result.weightFlag = true;

                } 
            // 5: If no available units
            } else if(!ingredient.quantity && !ingredient.weight) {
                result.unit = 'to taste';
            } else {
                // 4: Food Type plus Weight
                result.unit = ingredient.food;
                result.weightFlag = true;
            }

            console.log(
                `${index}: Quantity: ${result.quantity}. Unit: ${result.unit}. Food: ${result.food} Weight: ${result.weight}. WeightFlag: ${result.weightFlag}`
            );

            return result;
        });

        this.parsedIngredients = newIngredients;
    }

}