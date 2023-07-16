import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import styled from '@mui/material/styles/styled';

let drawerWidth = 240; //default value

const FooterContainer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        transition: theme.transitions.create(['margin','width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(100% + ${drawerWidth}px)`,
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
            width: `100%`
        }),
        backgroundColor:'black',
    }),
  );

function Copyright() {
  return (
    <Typography variant="body2" color="white">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Postgraduate Programme Review
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

const Footer = ({drawerWidthInput, drawerOpen}) => {
    drawerWidth = drawerWidthInput;
    return (
        <FooterContainer open={drawerOpen}>
            <ThemeProvider theme={defaultTheme}>
                <Box
                component="footer"
                sx={{
                    py: 1,
                    mt: 'auto',
                    color: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[800]
                        : theme.palette.grey[800],
                }}
                >
                <Container sx={{display:"flex",justifyContent:"center",alignItems:"center",}} maxWidth="sm">
                    <Copyright />
                </Container>
                </Box>
            </ThemeProvider>
        </FooterContainer>
    );
}


export default Footer;
