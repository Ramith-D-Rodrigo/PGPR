import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia
} from '@mui/material';

let title = null,content=null,message=null
const DashboardCard = ({title,content,message}) => {
  return (
    
        <Card sx={{ width: "18rem", height: "10rem", textAlign: 'center', display:'flex', alignItems:'center', justifyContent:'center',backgroundColor:'#D8E6FC',
                    borderBottom:"4px solid #191970" }}>
            <CardContent>
                <Typography gutterBottom variant='h6' component='div'>
                      {title}
                </Typography>
                <Typography gutterBottom variant='body2' color='text.secondary' component='div'>
                    {content}
                </Typography>
                <Typography gutterBottom variant='h6' component='div'>
                    {message}
                </Typography>
            </CardContent>
        </Card>
  )
}

export default DashboardCard
