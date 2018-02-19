import React, { Component } from 'react';

import productData from './productData';
import InventoryProduct from './InventoryProduct';

class ProductsList extends Component {
  render() {
    const products = productData.map((product) => {
      return <InventoryProduct
        key={product.id}
        title={product.title}
        price={product.price}
        quantity={product.quantity}
      />
    });
    return (
      <div>
        {products}
      </div>
    );
  }
}

export default ProductsList;
