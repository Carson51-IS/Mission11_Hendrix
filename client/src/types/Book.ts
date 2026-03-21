/**
 * Book type matching the API response.
 */
export interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

/**
 * Paginated books API response.
 */
export interface BooksResponse {
  books: Book[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
