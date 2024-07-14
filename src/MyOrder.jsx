import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:3000/orders/${id}`);
        setOrders(orders.filter(order => order.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderNumber}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.products ? order.products.length : 0}</td>
              <td>{order.finalPrice}</td>
              <td>
                <Link to={`/add-order/${order.id}`}>Edit Order</Link>
                <button onClick={() => deleteOrder(order.id)}>Delete Order</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-order">Add New Order</Link>
    </div>
  );
};

export default MyOrder;
