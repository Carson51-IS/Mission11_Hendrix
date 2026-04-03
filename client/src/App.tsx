import { Route, Routes } from 'react-router-dom';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminBooks from './components/AdminBooks';
import Layout from './components/Layout';
import { CartProvider } from './context/CartProvider';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<BookList />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="adminbooks" element={<AdminBooks />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
