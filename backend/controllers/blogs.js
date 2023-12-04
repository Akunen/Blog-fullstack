const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { error } = require('../utils/logger');




blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: 'jotain meni pieleen...' });
  }
});

blogsRouter.post('/', async (request, response) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
  } catch {
    return response.status(401).json({ error: 'token puuttuu tai on virheellinen' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(401).json({ error: error.message });
  }

  const body = request.body;

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'virheellinen token' });
    }
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error(error);
    response.status(500).json(error);
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.error(error);
    response.status(400).send({ error: 'jotain meni pieleen...' });
  }
});


module.exports = blogsRouter;
