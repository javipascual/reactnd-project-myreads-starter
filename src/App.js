import React from 'react'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import BookShelf from './BookShelf'
import SearchBooks from './SearchBooks'
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
          const book = prevState.books.find(book => book.id === b.id);
          return {...b, shelf: book ? book.shelf : 'none'};
        })
      }))
    });
    
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/search' render={() => (
          <SearchBooks books={this.state.searchBooks}
                       onShelfChange={this.onShelfChange}
                       onSearchChange={this.onSearchChange}
          />)}
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
