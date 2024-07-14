import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';

const AddEditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState({ orderNumber: '', date: '', products: [], finalPrice: 0 });
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    } else {
      initializeNewOrder(); // Set initial state for new order
    }
    fetchProducts();
  }, [id]);

  const initializeNewOrder = () => {
    setOrder({
      orderNumber: '',
      date: new Date().toISOString().split('T')[0],
      products: [], // Initialize with an empty array
      finalPrice: 0
    });
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/orders/${id}`);
      const orderData = response.data;
      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/products');
      setProductList(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (product) => {
    setOrder((prev) => ({
      ...prev,
      products: [...prev.products, product],
      finalPrice: prev.finalPrice + product.totalPrice
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3000/orders/${id}`, order);
      } else {
        await axios.post('http://localhost:3000/orders', order);
      }
      navigate('/my-orders');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = order.products.filter(product => product.id !== productId);
    const productToRemove = order.products.find(product => product.id === productId);
    setOrder((prev) => ({
      ...prev,
      products: updatedProducts,
      finalPrice: prev.finalPrice - productToRemove.totalPrice
    }));
  };

  return (
    <div>
      <h1>{id ? 'Edit Order' : 'Add Order'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Order #:
            <input
              type="text"
              name="orderNumber"
              value={order.orderNumber}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={order.date}
              disabled
            />
          </label>
        </div>
        <div>
          <label>
            # Products:
            <input
              type="number"
              value={order.products.length}
              disabled
            />
          </label>
        </div>
        <div>
          <label>
            Final Price:
            <input
              type="number"
              value={order.finalPrice}
              disabled
            />
          </label>
        </div>
        <ProductForm products={productList} onAddProduct={handleAddProduct} />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Unit Price</th>
              <th>Qty</th>
              <th>Total Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.unitPrice}</td>
                <td>{product.quantity}</td>
                <td>{product.totalPrice}</td>
                <td>
                  <button type="button" onClick={() => handleDeleteProduct(product.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit">{id ? 'Update Order' : 'Add Order'}</button>
      </form>
    </div>
  );
};

export default AddEditOrder;
