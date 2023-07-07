import {
    Box,
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia
} from '@mui/material'
let title = null,content=null,message=null
const DashboardCard = ({title,content,message}) => {
  return (
    
        <Card sx={{ maxWidth: 345, minHeight: 180, textAlign: 'center', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                      {title}
                </Typography>
                <Typography gutterBottom variant='body2' color='text.secondary' component='div'>
                    {content}
                </Typography>
                <Typography gutterBottom variant='h5' component='div'>
                    {message}
                </Typography>
            </CardContent>
        </Card>
  )
}

export default DashboardCard
