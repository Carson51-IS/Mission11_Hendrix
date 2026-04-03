import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Book } from '../types/Book';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://mission13hendrix-f2cpdmgtava8e2as.mexicocentral-01.azurewebsites.net/api/books';

const emptyBook: Omit<Book, 'bookID'> = {
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Omit<Book, 'bookID'>>(emptyBook);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}?pageSize=1000`);
      setBooks(res.data.books);
    } catch {
      setError('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pageCount'
          ? parseInt(value, 10) || 0
          : name === 'price'
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const openAddForm = () => {
    setEditingBook(null);
    setFormData(emptyBook);
    setShowForm(true);
    setError(null);
  };

  const openEditForm = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      classification: book.classification,
      category: book.category,
      pageCount: book.pageCount,
      price: book.price,
    });
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingBook) {
        await axios.put(`${API_BASE}/${editingBook.bookID}`, {
          bookID: editingBook.bookID,
          ...formData,
        });
        showSuccess(`"${formData.title}" updated successfully.`);
      } else {
        await axios.post(API_BASE, formData);
        showSuccess(`"${formData.title}" added successfully.`);
      }

      setShowForm(false);
      setEditingBook(null);
      setFormData(emptyBook);
      await fetchAllBooks();
    } catch {
      setError('Failed to save book. Check all fields and try again.');
    }
  };

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`)) return;

    try {
      await axios.delete(`${API_BASE}/${book.bookID}`);
      showSuccess(`"${book.title}" deleted.`);
      await fetchAllBooks();
    } catch {
      setError('Failed to delete book.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData(emptyBook);
    setError(null);
  };

  if (loading && books.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Admin &ndash; Manage Books</h1>
        <button className="btn btn-success" onClick={openAddForm}>
          + Add Book
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show">
          {successMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMsg(null)}
          />
        </div>
      )}

      {showForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            {editingBook ? `Edit: ${editingBook.title}` : 'Add New Book'}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Author</label>
                  <input
                    className="form-control"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Publisher</label>
                  <input
                    className="form-control"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">ISBN</label>
                  <input
                    className="form-control"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Classification</label>
                  <input
                    className="form-control"
                    name="classification"
                    value={formData.classification}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Page Count</label>
                  <input
                    className="form-control"
                    name="pageCount"
                    type="number"
                    min="1"
                    value={formData.pageCount || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Price</label>
                  <input
                    className="form-control"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Save Changes' : 'Add Book'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th className="text-end">Price</th>
              <th className="text-center" style={{ width: '140px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td className="text-end">${book.price.toFixed(2)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => openEditForm(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(book)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-muted small">{books.length} books total</p>
    </div>
  );
}
