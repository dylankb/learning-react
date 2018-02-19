import React, { Component } from 'react';

import ProductsList from './ProductsList';

class ProductsContainer extends Component {
  render() {

    return (
      <div>
        <h1>Shopping Cart</h1>
        <ProductsList />
      </div>
    );
  }
}

export default ProductsContainer;
