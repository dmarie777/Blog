
const totalLikes = (objList) => {
    return objList.reduce((sum, b) => sum + b.likes, 0)
}

module.exports = {
    totalLikes
}