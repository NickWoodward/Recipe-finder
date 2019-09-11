export default class Likes {
    constructor() {
        this.likes = [];
    };

    addLike(id, title, author, img) {
        const item = {
            id,
            title,
            author,
            img
        };

        this.likes.push(item);
        // Save data to local storage
        this.persistLikes();
        return item;
    };

    removeLike(id) {
        const index = this.likes.findIndex(item => item.id === id);
        this.likes.splice(index, 1);

        // Save data to local storage
        this.persistLikes();
    }

    isLiked(id) {
        return this.likes.findIndex(item => item.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistLikes() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readLikes() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }
}