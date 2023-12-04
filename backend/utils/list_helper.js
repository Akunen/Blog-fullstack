const dummy = (blogs) => {
  return 1
}

// Lasketaan taulukon blogien yhteenlasketut tykkäykset
const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let favorite = blogs[0]

  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  let blogCount = {};   // Alustetaan blogimäärä-objekti
  // Alustetaan muuttujat suurimmalle kirjoittajalle ja hänen blogimäärälleen
  let author = ''; 
  let max = 0; 

  // Käydään läpi jokainen blogi
  blogs.forEach((blog) => {
    // Lisätään tai päivitetään kirjoittajan blogien määrä
    if (blogCount[blog.author]) {
      blogCount[blog.author] += 1;
    } else {
      blogCount[blog.author] = 1;
    }

    
    // Tarkistetaan onko kirjoittaja kirjoittanut enemmän blogeja kuin aiemmin
    if (blogCount[blog.author] > max) {
      author = blog.author;
      max = blogCount[blog.author];
    }
  });

  return {
    author: author,
    blogs: max
  }
}

const mostLikes = (blogs) => {
  let likeCount = {};   // Alustetaan tykkäysmäärä-objekti
  // Alustetaan muuttujat suurimmalle kirjoittajalle ja hänen tykkäysmäärälleen
  let author = ''; 
  let max = 0; 

  // Käydään läpi jokainen blogi
  blogs.forEach((blog) => {
    // Lisätään tai päivitetään kirjoittajan tykkäysten määrä
    if (likeCount[blog.author]) {
      likeCount[blog.author] += blog.likes;
    } else {
      likeCount[blog.author] = blog.likes;
    }

    
    // Tarkistetaan onko kirjoittaja saanut enemmän tykkäyksiä kuin aiemmin
    if (likeCount[blog.author] > max) {
      author = blog.author;
      max = likeCount[blog.author];
    }
  });

  return {
    author: author,
    likes: max
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

