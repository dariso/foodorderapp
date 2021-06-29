import React from 'react';

const CartContext = React.createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removedItem: (id) => {},
  clearCart: () => {},
});

export default CartContext;
