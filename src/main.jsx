import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyOrder from './MyOrder';
import AddEditOrder from './AddEditOrder';

const Main = () => (
  <Router>
    <Routes>
      <Route path="/my-orders" element={<MyOrder />} />
      <Route path="/add-order/:id?" element={<AddEditOrder />} />
      <Route path="/" element={<MyOrder />} />
    </Routes>
  </Router>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);
