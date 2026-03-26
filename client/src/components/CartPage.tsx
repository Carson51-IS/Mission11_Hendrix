import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { getContinueShoppingUrl } from '../lib/cartSession';

/**
 * Shopping cart page: line items with quantity, price, subtotal, and order total.
 */
export default function CartPage() {
  const { items, cartTotal, setLineQuantity, removeLine } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate(getContinueShoppingUrl());
  };

  if (items.length === 0) {
    return (
      <div className="container-fluid py-4 px-3">
        <div className="row mb-4">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Books</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Cart
                </li>
              </ol>
            </nav>
            <h1 className="h3 mb-3">Shopping cart</h1>
            <p className="text-muted">Your cart is empty.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleContinueShopping}
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-3">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Books</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Cart
              </li>
            </ol>
          </nav>
          <h1 className="h3 mb-3">Shopping cart</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Author</th>
                  <th className="text-end" scope="col">
                    Price
                  </th>
                  <th className="text-end" scope="col">
                    Qty
                  </th>
                  <th className="text-end" scope="col">
                    Subtotal
                  </th>
                  <th scope="col" className="text-center">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((line) => {
                  const subtotal = line.price * line.quantity;
                  return (
                    <tr key={line.bookId}>
                      <td>{line.title}</td>
                      <td>{line.author}</td>
                      <td className="text-end">${line.price.toFixed(2)}</td>
                      <td className="text-end">
                        <input
                          type="number"
                          className="form-control form-control-sm text-end"
                          style={{ maxWidth: '5rem', marginLeft: 'auto' }}
                          min={1}
                          value={line.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (!Number.isNaN(v)) {
                              setLineQuantity(line.bookId, v);
                            }
                          }}
                        />
                      </td>
                      <td className="text-end">${subtotal.toFixed(2)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeLine(line.bookId)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="fw-bold">
                  <td colSpan={4} className="text-end">
                    Total
                  </td>
                  <td className="text-end">${cartTotal.toFixed(2)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleContinueShopping}
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
