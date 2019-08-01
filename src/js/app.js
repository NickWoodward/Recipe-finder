// Global app controller
import "../style.css";
import '../assets/icons.svg';

import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();


async function getResults(query) {
    // axios(`https://www.food2fork.com/api/search?key=${process.env.F2F_KEY}` )
    console.log(process.env.F2F_KEY);
}

getResults();


