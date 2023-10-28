import { Snackbar,Alert } from '@mui/material'

function StatusMessage({ open, onClose, message,autoHideDuration=null,severity}) {
  return (
    <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
        <Alert onClose={onClose} severity={severity}>
            {message}
        </Alert>
    </Snackbar>
  )
}

export default StatusMessage