import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import Book from './Book';
import './App.css'

class BooksApp extends React.Component {

  constructor(props) {
    super(props);
    this.onShelfChange = this.onShelfChange.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  state = {
    books: [],
    searchBooks: [],
  }
  
  componentDidMount() {
    BooksAPI.getAll().then(books =>
      this.setState(() =>  ({ books: books.slice(0) }))
    );
  }

  onShelfChange(book, shelf) {
    BooksAPI.update(book, shelf).then(books => {
      this.setState((prevState) => ({
        books : prevState.books.map(b => {
          if (books.currentlyReading.includes(b.id))
            return {...b, shelf: "currentlyReading"}
          else if (books.wantToRead.includes(b.id))
            return {...b, shelf: "wantToRead"}
          else if (books.read.includes(b.id))
            return {...b, shelf: "read"}
          else
            return {...b, shelf: 'none'};
        })
      }))
    });
  }

  onSearchChange(e) {
    BooksAPI.search(e.target.value, 50).then(searchBooks => {
      this.setState((prevState) => ({
        searchBooks : searchBooks.map(b => {
          // When a book is on a bookshelf, it should have the same state
          // on both the main application page and the search page
          const idx = prevState.books.indexOf(b.id);
          if (idx >= 0)
            return {...b, shelf: prevState.books[idx].shelf};
          else
            return {...b, shelf: 'none'};
        })
      }))
    });
    
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link className="close-search" to="/">close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" placeholder="Search by title or author" onChange={this.onSearchChange}/>      
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
              {this.state.searchBooks.map((book, i) => <li key={i}>
                                <Book
                                  title={book.title}
                                  authors={book.authors}
                                  coverUrl={book.imageLinks.smallThumbnail}
                                  shelf={book.shelf}
                                  onShelfChange={cat => this.onShelfChange(book, cat)}
                                />
                              </li>
                )
              }
              </ol>
            </div>
          </div>)}
        />
        <Route exact path='/' render={() => (       
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              {<BookShelf title={"Currently Reading"}
                          books={this.state.books.filter(b => b.shelf === "currentlyReading")}
                          onShelfChange={this.onShelfChange}
              />}
              {<BookShelf title={"Want to Read"}
                          books={this.state.books.filter(b => b.shelf === "wantToRead")}
                          onShelfChange={this.onShelfChange}
              />}
              {<BookShelf title={"Read"}
                          books={this.state.books.filter(b => b.shelf === "read")}
                          onShelfChange={this.onShelfChange}
              />}
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>)}
        />
      </div>
    )
  }
}

export default BooksApp
