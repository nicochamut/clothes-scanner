import styled from "styled-components";
import React from "react";

const ProductDetails = ({ product }) => {
  console.log(product);
  return (
    <ProductDetailsStyled>
      <img src={product.image} />
      <h1>{product.descriart}</h1>
      <h2>${product.price}</h2>
      <h3>stock: {product.stock}</h3>
    </ProductDetailsStyled>
  );
};

const ProductDetailsStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  img {
    width: 400px;
  }
`;

export default ProductDetails;
