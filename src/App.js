import React from 'react'
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
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: true,
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
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/* 
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
                  
                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
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
          </div>
        ) : (
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
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
