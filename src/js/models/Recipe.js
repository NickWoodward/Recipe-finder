import axios from 'axios';

export default class Recipe {
    constructor(uri) {
        this.uri = uri;
    }

    async getRecipe() {
        try {
            const recipeID = encodeURIComponent(`${process.env.EDAMAM_RECIPE_URL}${this.uri}`);
            const result = await axios(`${process.env.EDAMAM_URL}?app_key=${process.env.EDAMAM_KEY}&app_id=${process.env.EDAMAM_ID}&r=${recipeID}`);
            this.title = result.data[0].label;
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

    // Parse ingredients
    parseIngredients() {
        const newIngredients = this.ingredients.map((ingredient) => {
            let result = {
                food: ingredient.food,
                description: ingredient.text
            };

            // Ideally use the quantity
            if(ingredient.quantity && ingredient.measure !== "gram"){
                // If there's no unit with the quantity, use quantity + food type
                // NB: a quantity of '1' with a <unit> type is usually suspect (1 black pepper, 1 milk chocolate etc), add gram weight + food type
                if(ingredient.measure === "<unit>") 
                    result.amount = ingredient.quantity === 1?  
                        `${ingredient.weight.toFixed(1)}g ${ingredient.food}`:`${ingredient.quantity} ${ingredient.food}`;
                // Else use quantity + the parsed unit
                else result.amount = `${ingredient.quantity} ${this.parseMeasurement(ingredient.quantity, ingredient.measure)}`;
            } 
            // If there's no quantity or weight, use 'to taste'
            else if(!ingredient.quantity && !ingredient.weight){
                result.amount = `to taste`
            } 
            // Else just use the gram weight
            else {
                result.amount = `${ingredient.weight.toFixed(1)}g`
            }
            return result;
        });

        console.log(this.ingredients);
        return newIngredients;
    }

    parseMeasurement(quantity, measurement){
        // Ignore <unit> as a measurement
        if(measurement === '<unit>') return measurement;
        // If the quantity is not exactly one, make the measurement plural
        else if(quantity !== 1) {
            // Add unusual cases here
            switch(measurement) {
                case 'leaf': return 'leaves';
                default: return `${measurement}s`;
            }
        } else {
            return measurement;
        }
    }

}