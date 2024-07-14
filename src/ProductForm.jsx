import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductForm = ({ products, onAddProduct }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!selectedProduct) {
      alert('Please select a product.');
      return;
    }

    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (product) {
      const totalPrice = product.unitPrice * quantity;
      onAddProduct({ ...product, quantity, totalPrice });
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  return (
    <div>
      <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
        <option value="" disabled>Select a product</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name} - ${product.unitPrice.toFixed(2)}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={quantity}
        min="1"
        onChange={e => setQuantity(parseInt(e.target.value))}
      />
      <button type="button" onClick={handleAdd}>Add Product</button>
    </div>
  );
};

ProductForm.propTypes = {
  products: PropTypes.array.isRequired,
  onAddProduct: PropTypes.func.isRequired
};

export default ProductForm;
