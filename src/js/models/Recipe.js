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

    updateServings(amount){
        // Guard against servings < 1
        if(amount === -1 && this.servings === 1) return;
        this.servings = amount === -1? --this.servings : ++this.servings;
        this.updateIngredientQuantities();
    }

    updateIngredientQuantities() {
        this.parsedIngredients.forEach(ingredient => {
            ingredient.quantity = ingredient.qtyPerServing * this.servings;
            ingredient.weight = ingredient.weightPerServing * this.servings;
        });
    }

    // Parse ingredients
    parseIngredients() {

        const newIngredients = this.ingredients.map((ingredient, index) => {
            let result = {
                qtyPerServing: ingredient.quantity / this.servings,
                weightPerServing: ingredient.weight / this.servings,
                displayType: '',
                food: ingredient.food,
                text: ingredient.text,
                weight: ingredient.weight,
                quantity: ingredient.quantity,
                // Unit will be ingredient.measurement or ingredient.food type depending on the item and if quantity is available
                unit: ''
            };
            console.log(ingredient)
            // Structure options:
            // 1: Quantity + Unit(qty-unit) (Excluding 'gram')
            // 2: Quantity + Food Type (No unit available)
            // 3: Quantity + Food Type + Weight (Needed more specificity, eg: 2 chorizos (120g)) // Use weightFlag
            // 4: Food Type + Weight // Use weightFlag
            // 5: Ouput 'to taste'

            // Reset the quantity to '0' if there's no measurement & it's something that shouldn't have a quantity
            // Eg: 1 black pepper, 1 yellow cake, 1 dark chocolate etc don't make sense
            const exceptions = ['cheddar', 'lemonade', 'black pepper', 'yellow cake', 'chocolate', 'milk chocolate', 'monterey jack', 'grapes', 'pie crust', 'pizza dough', 'fresh ginger', 'peppercorns'];
            if((!ingredient.measure || ingredient.measure === '<unit>') && exceptions.includes(ingredient.food.toLowerCase())) {
                ingredient.quantity = 0;
                result.quantity = 0;
            }

            // Check quantity available
            if (ingredient.quantity && ingredient.measure.toLowerCase() !== "gram") {
                // Check unit available
                if (ingredient.measure !== "<unit>") {
                    // 1: Quantity + Unit
                    result.unit = ingredient.measure;
                    result.displayType = 'qty-unit';
                // 2:  Quantity + Food type
                } else {
                    result.unit = ingredient.food;
                    result.weightFlag = true;
                    result.displayType = 'food-unit'

                } 
            // 5: If no available units
            } else if(!ingredient.quantity && !ingredient.weight) {
                result.unit = 'to taste';
                result.displayType = 'to-taste';
            } else {
                // 4: Food Type plus Weight
                result.unit = ingredient.food;
                result.weightFlag = true;
                result.displayType = 'food-weight'
            }

            return result;
        });

        this.parsedIngredients = newIngredients;
    }

    // Problem API data:

    /** 
     * Pickled Grapes
     * "1 red grapes", food-unit
     * API: qty 1, measure <unit>, food red grapes, weight 4.9
     * Parsed: qty 1, unit red grapes, food red grapes, weight 4.9
     */

     /** 
      * 
      * "1 Milk Chocolate", food-unit
      * API: qty 1, measure <unit>, food Milk Chocolate, weight 7
      * Parsed: qty 1, unit Milk Chocolate, food Milk Chocolate, weight 7
      */

      /**
       * 
       * "6 gelatines (42g)"
       * API: qty 6, measure <unit>, food gelatine, weight 42
       * Parsed: qty 6, unit gelatine, food gelatine, weight 42
       */

       /**
        * Shaved Asparagus Pizza
        * 1 pizza dough (228g)
        * API: qty 1,  measure <unit>, food pizza dough, weight 228
        * Parsed: qty 1, unit pizza dough, food pizza dough, weight 228 
        */

        /**
         * Pizza pizzas
         * "1 monterey jack (28g)"
         * API: qty 1, measure <unit>, food monterey jack, weight 28
         * Parsed: qty 1, unit monteray jack, food monteray jack, weight 28
         */
}