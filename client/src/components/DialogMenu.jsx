import {CircularProgress, Typography} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { useState } from 'react';


const DialogMenu = ({Message, Warning, Actions, Open, onClose,onSubmit}) => {

    const [pgprs, setPgprs] = useState([]);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog
            fullScreen={fullScreen}
            open={Open}
            onClose={onClose}
        >
            <DialogTitle id="submit-applicationID">
            {Message}
            </DialogTitle>
            <DialogContent>
            <DialogContentText>
                {Warning}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button autoFocus onClick={onClose}>
                {Actions.cancel}
            </Button>
            <Button onClick={onSubmit} autoFocus>
                {Actions.submit}
            </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogMenu;