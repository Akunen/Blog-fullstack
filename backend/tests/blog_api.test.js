const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({}); // Clear the User collection

  const user = new User({ username: 'test', password: 'test' }); // Create a new user
  await user.save();

  const userForToken = {
    username: user.username,
    id: user._id,
  };

   token = jwt.sign(userForToken, process.env.SECRET); // Generate a token for the user

  await Blog.insertMany(helper.testBlogs);
});

describe('Blogitestit', () => {
  test('palauttaa oikean määrän blogeja JSON-muodossa', async () => {
    const response = await api.get('/api/blogs');

    //Tarkistetaan, että vastauksessa on oikea määrä blogeja
    expect(response.body).toHaveLength(helper.testBlogs.length);

    //Tarkistetaan, että vastauksen tyyppi on JSON
    expect(response.type).toMatch(/json/);
  });

  test('blogien indentifioiva kenttä on nimeltään id', async () => {
    const response = await api.get('/api/blogs');

    //Käydään läpi kaikki blogit ja tarkistetaan, että niillä on kenttä id
    for (let i = 0; i < response.body.length; i++) {
      expect(response.body[i].id).toBeDefined();
    }
  });

  test('jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      __v: 0
    };

    const response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog);


    expect(response.body.likes).toBe(0);
  });

  test('jos kentälle title ei anneta arvoa, palautetaan statuskoodi 400', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    };

    const response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog);

    expect(response.status).toBe(400);
  });

  test('jos kentälle url ei anneta arvoa, palautetaan statuskoodi 400', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
      __v: 0
    };

    const response = await api.post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog);

    expect(response.status).toBe(400);
  }
  );

  test('yksittäisen blogin poisto', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    };
  
    const savedBlog = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
  
    await api
      .delete(`/api/blogs/${savedBlog.body.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const response = await api.get('/api/blogs');

      //Tarkistetaan, että vastauksessa on oikea määrä blogeja
    expect(response.body).toHaveLength(helper.testBlogs.length);
  });


  test('blogi voidaan päivittää', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    };

    //Lisätään uusi blogi tietokantaan
    const savedBlog = await new Blog(newBlog).save();
  
    const updatedBlog = {
      likes: 10
    };
  
  // määritellään muuttuja response, johon tallennetaan vastaus
  let response;
  try {
    response = await api
      .put(`/api/blogs/${savedBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  } catch (error) {
    console.error(error);
  }

  const returnedBlog = response.body;
  // tarkistetaan että vastauksen kenttä likes on päivittynyt
  expect(returnedBlog.likes).toEqual(updatedBlog.likes);
  });

  test('blogia ei voida lisätä ilman tokenia', async () => {
    const newBlog =   {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  
    const response = await api.get('/api/blogs');

      //Tarkistetaan, että vastauksessa on oikea määrä blogeja
    expect(response.body).toHaveLength(helper.testBlogs.length);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
