import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  styled,
} from "@mui/material";

export default function CustomizedDialogs(props) {
  const {
    title,
    body,
    open,
    cancelText,
    handleClose,
    handleSubmit,
    submitText,
  } = props;

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "600px",
          // maxWidth: "none", // Allow Dialog to expand as needed
          width: "290px", // Remove forced width
          display: "inline-block", // Shrink to fit content
          margin: "auto", // Center it properly
        },
      }}
    >
      <DialogTitle
        id="customized-dialog-title"
        sx={{
          fontSize: "0.7rem", // 👈 Set title font size
        }}
        onClose={handleClose}
      >
        {title}
      </DialogTitle>
      <DialogContent dividers>
        {body}
        {props.children}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            fontSize: "0.7rem", // even smaller font
            backgroundColor: "#57636f",
            padding: "2px 8px", // less padding
            minHeight: "26px", // shorter button
            lineHeight: 1, // tight line height
            "&:hover": {
              backgroundColor: "#45515c",
            },
          }}
        >
          {cancelText || "إلغاء"}
        </Button>
        {submitText && (
          <Button
            variant="contained"
            autoFocus
            onClick={handleSubmit}
            sx={{
              fontSize: "0.7rem",
              backgroundColor: "#57636f",
              padding: "2px 8px",
              minHeight: "26px",
              lineHeight: 1,
              "&:hover": {
                backgroundColor: "#45515c",
              },
            }}
          >
            {submitText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
