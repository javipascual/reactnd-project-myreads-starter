import React from 'react';
import PropTypes from 'prop-types';
import Book from './Book';

class BookShelf extends React.Component {

  render() {
    return <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
        {this.props.books.map((book, i) => <li key={i}>
                                             <Book
                                               title={book.title}
                                               authors={book.authors}
                                               coverUrl={book.imageLinks.smallThumbnail}
                                               shelf={book.shelf}
                                               onShelfChange={cat => this.props.onShelfChange(book, cat)}
                                             />
                                           </li>)
        }
        </ol>
      </div>
    </div>
  }
}

BookShelf.propTypes = {
  title: PropTypes.string.isRequired,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  onShelfChange: PropTypes.func.isRequired,
};

export default BookShelf