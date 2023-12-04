
import {useState}  from 'react';

const BlogForm = ({ handleCreateProp }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');


  const handleCreate = (event) => {
    event.preventDefault();
    handleCreateProp({
      title: title,
      author: author,
      url: url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  }

  return (
    <form onSubmit={handleCreate}>
      <div>
        title: <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        author: <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        url: <input type="text" value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;