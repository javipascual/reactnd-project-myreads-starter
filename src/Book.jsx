import React from 'react';
import PropTypes from 'prop-types';

class Book extends React.Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onShelfChange(event.target.value);
  }

  render() {
    return <div className="book">
      <div className="book-top">
        <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${this.props.coverUrl}` }}></div>
          <div className="book-shelf-changer">
            <select value={this.props.shelf} onChange={this.handleChange}>
              <option value="none" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
      <div className="book-title">{this.props.title}</div>
      <div className="book-authors">{this.props.authors && this.props.authors.join(', ')}</div>
    </div>
  }
}

Book.propTypes = {
  title: PropTypes.string.isRequired,
  authors: PropTypes.arrayOf(PropTypes.string),
  coverUrl: PropTypes.string.isRequired,
  shelf: PropTypes.string.isRequired,
  onShelfChange: PropTypes.func.isRequired,
};

export default Book