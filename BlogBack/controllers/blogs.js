const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(err => console.log(err))
  })

blogRouter.post('/', (request, response) => {
  if (!request.body.likes) request.body.likes = 0; 
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  } 
    const blog = new Blog(request.body)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  
  })

module.exports = blogRouter