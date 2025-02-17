import React, { useState } from 'react';
import './ActionModal.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ActionModal = (props) => {
    return (
        <Dialog {...props}>
            <DialogTitle id="form-dialog-title" className='ModalTitle'>{props.title}</DialogTitle>
            {props.children}
        </Dialog>
    );
}

export default ActionModal;