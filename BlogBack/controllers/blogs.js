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


blogRouter.put('/:id', (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
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

blogRouter.delete(`/:id`, (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

module.exports = blogRouter