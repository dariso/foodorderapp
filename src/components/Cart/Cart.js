import React, { useContext, useState, Fragment } from 'react';
import Modal from '../../components/UI/Modal';
import classes from './Cart.module.css';
import Checkout from './Checkout';
import CartItem from './CartItem';
import CartContext from '../../store/cart-context';

const Cart = (props) => {
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const cartCtx = useContext(CartContext);
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemoveHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    setDidSubmit(false);
    setSubmitErrorMessage('');
    try {
      const response = await fetch('https://food-order-app-efa84-default-rtdb.firebaseio.com/orders.json', {
        method: 'POST',
        body: JSON.stringify({
          user: userData,
          orderItems: cartCtx.items,
        }),
      });

      setIsSubmitting(false);
      setDidSubmit(true);

      if (!response.ok) {
        throw Error('Failed to send order');
      }
    } catch (error) {
      setSubmitErrorMessage(error.message);
      return;
    }
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes['cart-items']}>
      {cartCtx.items.map((item) => {
        return <CartItem key={item.id} name={item.name} amount={item.amount} price={item.price} onRemove={cartItemRemoveHandler.bind(null, item.id)} onAdd={cartItemAddHandler.bind(null, item)} />;
      })}
    </ul>
  );

  const modalActions = (
    <div className={classes.actions}>
      <button onClick={props.onClose} className={classes['button--alt']}>
        Close
      </button>
      {hasItems && (
        <button onClick={orderHandler} className={classes.button}>
          Order
        </button>
      )}
    </div>
  );

  const cartModalContent = (
    <Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose} />}
      {!isCheckout && modalActions}
    </Fragment>
  );

  const isSubmittingModalContent = <p>Sending order data...</p>;

  const didSubmitModalContent = (
    <Fragment>
      <p>Succesfully send the order!</p>
      <div className={classes.actions}>
        <button onClick={props.onClose} className={classes.button}>
          Close
        </button>
      </div>
    </Fragment>
  );

  const failedSubmitContent = (
    <Fragment>
      <p>There was an issue sending your order, please try later</p>
      <div className={classes.actions}>
        <button onClick={props.onClose} className={classes.button}>
          Close
        </button>
      </div>
    </Fragment>
  );

  return (
    <Modal onClose={props.onClose}>
      {!isSubmitting && !didSubmit && cartModalContent}
      {isSubmitting && isSubmittingModalContent}
      {!isSubmitting && didSubmit && !submitErrorMessage && didSubmitModalContent}
      {submitErrorMessage && failedSubmitContent}
    </Modal>
  );
};

export default Cart;
