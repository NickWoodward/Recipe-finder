import { elements } from './base';
import * as displayHelper from './displayHelper';

export const renderItem = item => {
    console.log(item);
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" dir="rtl" value="${displayHelper.formatNum(item.weightPerServing)}" step="1" class="shopping__count-value">
                <p>g</p>
            </div>
            <p class="shopping__description">${displayHelper.capitalise(item.food)}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="#icons_icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    const item = document.querySelector(`[date-itemid]=""${id}`);
    item.parentElement.removeChild(item);
}
