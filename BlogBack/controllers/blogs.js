const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    try {
      const blogs = await Blog.find({})
      response.json(blogs)
    } catch (err) {
      console.log(err)
    }
})

blogRouter.put('/:id', async(request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  try {
    const updatedBlog = Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (err) {
    console.log(err)
  }
})

blogRouter.post('/', async (request, response) => {
  if (!request.body.likes) request.body.likes = 0; 
  if (!request.body.title || !request.body.url) {
    return response.status(400).end()
  } 
  try {
    const blog = new Blog(request.body)
    const newblog = await blog.save()
    response.status(201).json(blog)
  } catch (err) {
    console.log(err)
  }
  })

blogRouter.delete(`/:id`, async (request, response) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (err){
    console.log(err)
  }
})

module.exports = blogRouter