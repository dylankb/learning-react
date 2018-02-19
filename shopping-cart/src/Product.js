import React from 'react';

const Product = (props) => (
  <div className="product">
    <p>{props.title} - ${props.price} x {props.quantity}</p>
  </div>
)

export default Product;
