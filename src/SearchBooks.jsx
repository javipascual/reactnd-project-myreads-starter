import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Book from './Book';

const SearchBooks = ({books, onShelfChange, onSearchChange}) =>
  <div className="search-books">
    <div className="search-books-bar">
      <Link className="close-search" to="/">close</Link>
      <div className="search-books-input-wrapper">
        <input type="text" placeholder="Search by title or author" onChange={onSearchChange}/>      
      </div>
    </div>
    <div className="search-books-results">
      <ol className="books-grid">
      {books.map((book, i) => <li key={i}>
          <Book
            title={book.title}
            authors={book.authors}
            coverUrl={book.imageLinks.smallThumbnail}
            shelf={book.shelf}
            onShelfChange={cat => onShelfChange(book, cat)}
          />
        </li>)
      }
      </ol>
    </div>
  </div>;

SearchBooks.propTypes = {
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onShelfChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default SearchBooks