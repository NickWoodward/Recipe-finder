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
        } catch (err) {
            console.log(err);
            alert('Something went wrong');
        }
    }

    // Test method that just estimates cooking time based on # of ingredients
    // Every 3 ingredients, increase cooking time by 15 minutes
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }
}