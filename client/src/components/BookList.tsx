import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Book, BooksResponse } from '../types/Book';

const API_BASE = 'http://localhost:5094/api/books';

/**
 * BookList component displays paginated books with sorting.
 * Dynamically builds pagination based on total items in the dataset.
 */
export default function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [sortAscending, setSortAscending] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books when page, pageSize, or sort changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortParam = sortAscending ? 'title' : 'title_desc';
        const response = await axios.get<BooksResponse>(
          `${API_BASE}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortParam}`
        );
        setBooks(response.data.books);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load books. Ensure the API is running.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageNumber, pageSize, sortAscending]);

  // Reset to page 1 when page size changes
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
    setPageNumber(1);
  };

  // Toggle sort order (A-Z vs Z-A)
  const handleSortToggle = () => {
    setSortAscending((prev) => !prev);
    setPageNumber(1);
  };

  // Build dynamic page number array for pagination links
  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info" role="status">
          Loading books...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h1 className="mb-4">Hilton&apos;s Bookstore</h1>

      {/* Controls: Results per page and Sort */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="pageSize" className="form-label">
            Results per page:
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
            style={{ maxWidth: '120px' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="col-md-6 text-md-end">
          <label className="form-label d-block">Sort by Title:</label>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={handleSortToggle}
          >
            {sortAscending ? 'A → Z' : 'Z → A'}
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Publisher</th>
              <th>ISBN</th>
              <th>Classification</th>
              <th>Category</th>
              <th>Pages</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td className="text-end">{book.pageCount}</td>
                <td className="text-end">${book.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - dynamically builds link tags based on total items */}
      {totalPages > 1 && (
        <nav aria-label="Books pagination" className="mt-4">
          <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${pageNumber <= 1 ? 'disabled' : ''}`}>
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber > 1) setPageNumber((p) => p - 1);
                }}
                aria-label="Previous page"
              >
                Previous
              </a>
            </li>
            {getPageNumbers().map((page) => (
              <li
                key={page}
                className={`page-item ${pageNumber === page ? 'active' : ''}`}
              >
                <a
                  href="#"
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setPageNumber(page);
                  }}
                >
                  {page}
                </a>
              </li>
            ))}
            <li
              className={`page-item ${pageNumber >= totalPages ? 'disabled' : ''}`}
            >
              <a
                href="#"
                className="page-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber < totalPages) setPageNumber((p) => p + 1);
                }}
                aria-label="Next page"
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      )}

      <p className="text-muted text-center small">
        Showing {(pageNumber - 1) * pageSize + 1} -{' '}
        {Math.min(pageNumber * pageSize, totalCount)} of {totalCount} books
      </p>
    </div>
  );
}
