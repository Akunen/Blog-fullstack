import { useState } from 'react';

const Blog = ({ blog, handleLike, handleDelete }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            {blog.likes}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          <div>
            <button onClick={() => handleDelete(blog) }>remove</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
