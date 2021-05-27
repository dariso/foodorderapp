import React, { Fragment } from 'react';
import ReactDom from 'react-dom';
import Backdrop from './Backdrop';
import classes from './Modal.module.css';

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDom.createPortal(<Backdrop click={props.onClose} />, portalElement)}
      {ReactDom.createPortal(<div className={classes.modal}>{props.children}</div>, portalElement)}
    </Fragment>
  );
};

export default Modal;
