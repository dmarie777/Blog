const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')

const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe ('when there is initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api 
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
})

describe ('viewing a specific blog', () => {
    test('unique identifier property of the blog posts is named id', async () => {
        const blogs = await helper.blogsInDb()
        expect(blogs[0].id).toBeDefined()
    })    
})

describe ('adition of a new blog', () => {
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
    
    test('if title or url properties are missing the backend responds with a 400 Bad Request', async() => {
        const newBlog1 = {
            author: "test2",
            url: "http://test2",
        }
        await api.post('/api/blogs')
            .send(newBlog1)
            .expect(400)
            
        const newBlog2 = {
            title: "test2",
            author: "test2",
        }
        await api.post('/api/blogs')
            .send(newBlog2)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('succeds with status code of 204 if id is valid and checks if the file was deleted', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength( helper.initialBlogs.length - 1 )

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('update of a blog', () => {
    test('the blog has been updated', async() => {
      const newBlog = {
        title: 'new',
        author: 'new',
        url: 'new',
        likes: 3
      }
    
      const blogs = await helper.blogsInDb()
      const idToUpdate = blogs[0].id
      const response = await api
            .put(`/api/blogs/${idToUpdate}`)
            .send(newBlog)

      expect(response.body.likes).toBe(3)
    })
})

afterAll (async () => {
    await mongoose.connection.close()
})