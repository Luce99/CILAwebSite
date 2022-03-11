import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import accounting from 'accounting';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';



export default function CheckoutCard({product: {id, name, productType, image, price, description}}) {

  return (
    <Card sx={{ maxWidth: 350 , backgroundColor: "#09b588", color: "#ffffff" }} className="card">
      <CardHeader
        action={
            <Typography
            className= 'images'
            variant = 'h5'
            color = "white"
            >
             {accounting.formatMoney(price, "$", "cop")}
            </Typography>
        }
        title= {name}
        subheader="En stock"
      />
      <CardMedia
        component="img"
        image = {image}
        height = "330" 
        alt="Blusa blanca de algodón"
      />
      <CardActions disableSpacing style={{ display: "flex",
      justifyContent: "space-around"}}>
        <IconButton aria-label="Delete icon" >
          <DeleteIcon fontSize='large' />
        </IconButton>
        <IconButton aria-label="Add circle Icon" >
          <AddCircleIcon fontSize='large' />
        </IconButton>
      </CardActions>
    </Card>
  );
}
