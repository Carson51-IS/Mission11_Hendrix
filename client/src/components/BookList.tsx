import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Book, BooksResponse } from '../types/Book';
import { useCart } from '../context/useCart';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5094/api/books';

/**
 * Book list with category filter, pagination synced to URL, sorting, and cart actions.
 */
export default function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { items, totalQuantity, cartTotal, addToCart } = useCart();

  const pageNumber = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.max(1, parseInt(searchParams.get('pageSize') || '5', 10));
  const category = searchParams.get('category') || 'All';
  const sortAscending = (searchParams.get('sort') || 'asc') !== 'desc';

  const setParams = useCallback(
    (updates: Record<string, string | number>) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        next.set(key, String(value));
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  // Load distinct categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get<string[]>(`${API_BASE}/categories`);
        setCategories(res.data);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Fetch books when URL query changes
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const sortParam = sortAscending ? 'title' : 'title_desc';
        const catParam = encodeURIComponent(category);
        const response = await axios.get<BooksResponse>(
          `${API_BASE}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortParam}&category=${catParam}`
        );
        setBooks(response.data.books);
        setTotalCount(response.data.totalCount);
        setTotalPages(response.data.totalPages);
      } catch {
        setError('Failed to load books. Ensure the API is running.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [pageNumber, pageSize, category, sortAscending]);

  // If filter reduces pages, clamp current page
  useEffect(() => {
    if (totalPages > 0 && pageNumber > totalPages) {
      setParams({ page: totalPages });
    }
  }, [totalPages, pageNumber, setParams]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setParams({ pageSize: newSize, page: 1 });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({ category: e.target.value, page: 1 });
  };

  const handleSortToggle = () => {
    setParams({ sort: sortAscending ? 'desc' : 'asc', page: 1 });
  };

  const handleAddToCart = (book: Book) => {
    const returnUrl = `${location.pathname}${location.search || ''}`;
    addToCart(book, returnUrl);
    setAddedMessage(`Added "${book.title}" to your cart.`);
    window.setTimeout(() => setAddedMessage(null), 3500);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading && books.length === 0 && !error) {
    return (
      <div className="container-fluid py-5 px-3">
        <div className="d-flex justify-content-center align-items-center gap-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading books...</span>
          </div>
          <span>Loading books...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4 px-3">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3 mb-5">
      <div className="row mb-3">
        <div className="col-12">
          <h1 className="h2 mb-0">Hilton&apos;s Bookstore</h1>
          <p className="text-muted small mb-0">
            Filter by category; pagination updates with the filtered set.
          </p>
        </div>
      </div>

      {addedMessage && (
        <div className="row mb-3">
          <div className="col-12">
            <div
              className="alert alert-success alert-dismissible fade show"
              role="status"
            >
              {addedMessage}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setAddedMessage(null)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Bootstrap accordion: collapsible filters (#notcoveredinthevideos) */}
          <div className="accordion mb-4" id="bookFiltersAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingFilters">
                <button
                  className={`accordion-button ${filtersOpen ? '' : 'collapsed'}`}
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="collapseFilters"
                  onClick={() => setFiltersOpen((o) => !o)}
                >
                  Filters &amp; sort
                </button>
              </h2>
              <div
                id="collapseFilters"
                className={`accordion-collapse collapse ${filtersOpen ? 'show' : ''}`}
                aria-labelledby="headingFilters"
              >
                <div className="accordion-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-6">
                      <label htmlFor="categoryFilter" className="form-label">
                        Category
                      </label>
                      <select
                        id="categoryFilter"
                        className="form-select"
                        value={category}
                        onChange={handleCategoryChange}
                      >
                        <option value="All">All categories</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label d-block">Sort by title</label>
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleSortToggle}
                      >
                        {sortAscending ? 'A → Z' : 'Z → A'}
                      </button>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="pageSize" className="form-label">
                        Results per page
                      </label>
                      <select
                        id="pageSize"
                        className="form-select"
                        style={{ maxWidth: '12rem' }}
                        value={pageSize}
                        onChange={handlePageSizeChange}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="d-flex align-items-center gap-2 mb-2 text-muted small">
              <div
                className="spinner-border spinner-border-sm text-primary"
                role="status"
              >
                <span className="visually-hidden">Refreshing...</span>
              </div>
              Updating results…
            </div>
          )}

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
                  <th className="text-end">Pages</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Cart</th>
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
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={() => handleAddToCart(book)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav aria-label="Books pagination" className="mt-4">
              <ul className="pagination justify-content-center flex-wrap">
                <li className={`page-item ${pageNumber <= 1 ? 'disabled' : ''}`}>
                  <a
                    href="#"
                    className="page-link"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNumber > 1) setParams({ page: pageNumber - 1 });
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
                        setParams({ page });
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
                      if (pageNumber < totalPages) {
                        setParams({ page: pageNumber + 1 });
                      }
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
            Showing{' '}
            {totalCount === 0
              ? 0
              : `${(pageNumber - 1) * pageSize + 1} – ${Math.min(pageNumber * pageSize, totalCount)}`}{' '}
            of {totalCount} books
          </p>
        </div>

        {/* Cart summary: sticky sidebar (#notcoveredinthevideos) */}
        <div className="col-lg-4">
          <div className="sticky-top pt-1" style={{ top: '1rem', zIndex: 1020 }}>
            <div className="card shadow-sm border-primary">
              <div className="card-header bg-primary text-white">
                Cart summary
              </div>
              <div className="card-body">
                {items.length === 0 ? (
                  <p className="text-muted mb-0 small">
                    No items yet. Add books from the table.
                  </p>
                ) : (
                  <ul className="list-group list-group-flush mb-3">
                    {items.map((line) => (
                      <li
                        key={line.bookId}
                        className="list-group-item d-flex justify-content-between align-items-start px-0"
                      >
                        <div className="me-2">
                          <div className="fw-semibold small">{line.title}</div>
                          <div className="text-muted small">
                            ${line.price.toFixed(2)} × {line.quantity}
                          </div>
                        </div>
                        <span className="badge bg-secondary rounded-pill">
                          {line.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <dl className="row small mb-0">
                  <dt className="col-6">Items</dt>
                  <dd className="col-6 text-end">{totalQuantity}</dd>
                  <dt className="col-6">Total</dt>
                  <dd className="col-6 text-end fw-bold">
                    ${cartTotal.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
