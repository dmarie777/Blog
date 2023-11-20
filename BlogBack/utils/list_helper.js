var _ = require('lodash')

const totalLikes = (objList) => {
    return objList.reduce((sum, b) => sum + b.likes, 0)
}

const favoriteBlog = (objList) => {
    const mostLiked =objList.sort((a,b) => b.likes - a.likes)[0] 
    return {
        title: mostLiked.title, 
        author: mostLiked.author, 
        likes: mostLiked.likes
    }
}

const mostBlogs = (objList) => {
    const group = _.countBy(objList, 'author');
    const mostBlogs = Object.entries(group).sort((a,b) => b[1] - a[1])[0];
    const result = {
        author: mostBlogs[0], 
        blogs: mostBlogs[1]
    };
    return result;
}

const mostLikes = (objList) => {
    const group = _.groupBy(objList, 'author');
    const mostLikes = Object.entries(group)
                            .map( e => ({ [e[0]]: e[1].reduce((a,b)=> a+b.likes, 0)}))
                            .sort((a,b) => b[1] - a[1])[0];
    const author = Object.keys(mostLikes)[0]

    const result = {
        author: author,
        likes: mostLikes[author]
    };
    return result;
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}