// Global app controller
import "../style.css";
import '../assets/icons.svg';

import axios from 'axios';

async function getResults(query) {
    const result = await axios(`https://www.food2fork.com/api/search?key=${process.env.F2F_KEY}&q=${query}` )
    const recipes = result.data.recipes;
    // console.log(result);
    console.log(recipes);

}

getResults('Pizza');


