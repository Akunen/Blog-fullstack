const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('User testit', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();
  });

  test('userin luominen epäonnistuu jos username ei ole uniikki', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('username ja password oltava tarpeeksi pitkiä', async () => {
    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password must be at least 3 characters long');
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
