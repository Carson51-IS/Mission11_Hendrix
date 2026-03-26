import { Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import Layout from './components/Layout';
import { CartProvider } from './context/CartProvider';

/**
 * Hilton's Bookstore: book list with category filter, cart, and routed cart page.
 */
function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<BookList />} />
          <Route path="cart" element={<CartPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
