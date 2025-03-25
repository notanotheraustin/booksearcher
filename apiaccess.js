const readingLists = {
  currentlyReading: [],
  toBeRead: [],
  finishedReading: [],
};

const API_KEY = ''; 

document.getElementById('search-button').addEventListener('click', function () {
  const query = document.getElementById('search-input').value;

  if (!query) {
    alert('Please enter a book title!');
    return;
  }

  
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${API_KEY}`
  )
    .then(response => response.json())
    .then(data => {
      const resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = ''; 

      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const book = item.volumeInfo;

          // Create a book card
          const bookCard = document.createElement('div');
          bookCard.className = 'book-card';

          bookCard.innerHTML = `
            <h2 class="clickable-title" data-id="${item.id}">${
            book.title || 'No Title Available'
          }</h2>
            <p><strong>Author(s):</strong> ${
              book.authors ? book.authors.join(', ') : 'Unknown'
            }</p>
            <p><strong>Publisher:</strong> ${book.publisher || 'Unknown'}</p>
            <p><strong>Published Date:</strong> ${
              book.publishedDate || 'Unknown'
            }</p>
            ${
              book.imageLinks
                ? `<img src="${book.imageLinks.thumbnail}" alt="${book.title} cover" />`
                : ''
            }
            <button class="bookmark-button" data-id="${item.id}" data-title="${
            book.title
          }">Bookmark</button>
          `;

          resultsContainer.appendChild(bookCard);
        });

        
        document.querySelectorAll('.clickable-title').forEach(title => {
          title.addEventListener('click', function () {
            const bookId = this.getAttribute('data-id');
            fetchBookDetails(bookId);
          });
        });

        
        document.querySelectorAll('.bookmark-button').forEach(button => {
          button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-id');
            const bookTitle = this.getAttribute('data-title');
            bookmarkBook(bookId, bookTitle);
          });
        });
      } else {
        resultsContainer.innerHTML = '<p>No results found.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching book data:', error);
      document.getElementById('results').innerHTML =
        '<p>Something went wrong. Please try again later.</p>';
    });
});


function fetchBookDetails(bookId) {
  fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      const book = data.volumeInfo;
      alert(`
        Title: ${book.title || 'No Title Available'}
        Author(s): ${book.authors ? book.authors.join(', ') : 'Unknown'}
        Description: ${book.description || 'No description available.'}
        Average Rating: ${book.averageRating || 'No rating available.'}
      `);
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
      alert('Could not fetch book details. Please try again later.');
    });
}


function bookmarkBook(bookId, bookTitle) {
  const list = prompt(
    'Add to which list? (currentlyReading, toBeRead, finishedReading)'
  );
  if (readingLists[list]) {
    readingLists[list].push({ id: bookId, title: bookTitle });
    alert(`Book added to ${list} list!`);
    console.log(readingLists); // For debugging
  } else {
    alert('Invalid list. Please choose: currentlyReading, toBeRead, or finishedReading.');
  }
}
