import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia
} from '@mui/material';

const DashboardCard = ({ title, content, message }) => {
    return (

        <Card sx={{
            width: "30rem", height: "15rem", textAlign: 'center', display: 'flex', justifyContent: 'center', backgroundColor: '#D8E6FC',
            borderBottom: "4px solid #191970"
        }}>
            <CardContent>
                <Typography gutterBottom variant='h5' component='div' sx={{mb: '2rem'}}>
                    {title}
                </Typography>
                <Typography gutterBottom variant='body2' color='text.secondary' component='div'>
                    {content}
                </Typography>
                <Typography gutterBottom variant='h6' component='div' sx={{mt: '2rem', bottom: '0'}}>
                    {message}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default DashboardCard
