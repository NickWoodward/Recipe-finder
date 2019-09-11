import * as displayHelper from './displayHelper';
import { elements } from './base';

export const renderLike = item => {
    const markup = `
        <li>
            <a class="likes__link" href="#${item.id}">
                <figure class="likes__fig">
                    <img src="${item.img}" alt="${item.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${item.title}</h4>
                    <p class="likes__author">${item.author}</p>
                </div>
            </a>
        </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const item = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(item) item.parentElement.removeChild(item);
};

export const toggleLikesMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0? 'visible':'hidden';
};