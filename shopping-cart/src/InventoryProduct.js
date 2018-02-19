import React, { Component } from 'react';

import Product from './Product';
import Button from './Button';

class InventoryProduct extends Component {
  render() {
    return (
      <div className="product-container">
        <div>
          <Product
            title={this.props.title}
            price={this.props.price}
            quantity={this.props.quantity}
          />
          <Button text="X" />
        </div>
        <div className="button-container">
          <Button text="Add to Cart" />
          <Button text="Edit" />
        </div>
      </div>
    );
  }
}

export default InventoryProduct;
