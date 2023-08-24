import "../styles/footer.css";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Link, Container } from '@mui/material';

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
        backgroundColor:'#1a1a1a',
    }),
  );

function Copyright() {
  return (
    <Typography variant="body2" color="white">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/material-ui/getting-started/">
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
