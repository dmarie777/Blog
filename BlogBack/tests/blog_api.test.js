const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects =  helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api 
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('unique identifier property of the blog posts is named id', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
})

test('a new blog has been created', async () => {
    const newBlog =     {
        title: "test",
        author: "test",
        url: "http://test",
        likes: 2,
      }  
    await api.post('/api/blogs')
       .send(newBlog)
       .expect(201)
       .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('test')
    expect(response.body).toHaveLength(helper.initialBlogs.length+1)
})

test('if the likes property is misssing it defaults to the value 0', async() => {
    const newBlog = {
        title: "test2",
        author: "test2",
        url: "http://test2",
    }
    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
    const response = await api.get('/api/blogs')
    const createdBlog = response.body.find(b => b.title === "test2")
    expect(createdBlog).toHaveProperty('likes', 0)
})

afterAll (async () => {
    await mongoose.connection.close()
})