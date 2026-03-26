import { Link, Outlet } from 'react-router-dom';
import { useCart } from '../context/useCart';

/**
 * Site shell with Bootstrap navbar and outlet for routed pages.
 */
export default function Layout() {
  const { totalQuantity } = useCart();

  return (
    <>
      <nav className="navbar navbar-expand-md navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-semibold" to="/">
            Hilton&apos;s Bookstore
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Books
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link position-relative" to="/cart">
                  Cart
                  {totalQuantity > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
