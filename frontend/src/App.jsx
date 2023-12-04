import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const showNotification = (message, isError) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const fetchBlogs = async () => {
    let blogs = await blogService.getAll();
    blogs = blogs.sort((a, b) => b.likes - a.likes);
    setBlogs(blogs);
  };

  const handleLike = async (blog) => {
    console.log('handleLike', blog);
    if (!blog || !blog.id) {
      console.error('Blog or blog ID is undefined');
      return;
    }
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id ,
    };

    try {
      let returnedBlog = await blogService.update(blog.id, updatedBlog);
      returnedBlog = { ...returnedBlog, user: blog.user };
      let updatedBlogs = blogs.map((b) =>
        b.id !== blog.id ? b : returnedBlog
      );
      updatedBlogs = updatedBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(updatedBlogs);
    } catch (exception) {
      showNotification(`Could not update blog: ${exception.message}`, true);
    }
  };

  const handleCreate = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const blog = await blogService.create(blogObject);
      fetchBlogs();
      setBlogs(blogs.concat(blog));
      showNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        false
      );
    } catch (exception) {
      console.log(exception);
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        showNotification(exception.response.data.error, true);
      } else {
        showNotification('Error creating blog', true);
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      showNotification('Successfully logged in', false);
    } catch (exception) {
      console.log(exception);
      if (
        exception.response &&
        exception.response.data &&
        exception.response.data.error
      ) {
        showNotification(exception.response.data.error, true);
      } else {
        showNotification('Tapahtui virhe', true);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
  };

  const handleDelete = async (blog) => {
    if (!blog || !blog.id) {
      console.error('Blog or blog ID is undefined');
      return;
    }
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return;
    }
    try {
      await blogService.del(blog.id);
      fetchBlogs();
      showNotification('Blog removed', false);
    } catch (exception) {
      showNotification(`Could not remove blog: ${exception.message}`, true);
    }
  };

  return (
    <div>
      <h1>Blogilista</h1>
      <Notification notification={notification} />
      {!user && (
        <div>
          <h2>Log in to application</h2>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      )}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <h2>create new</h2>
            <BlogForm handleCreateProp={handleCreate} />
          </Togglable>
          <h2>blogs</h2>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
