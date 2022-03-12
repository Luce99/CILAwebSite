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
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {useStateValue} from "../StateProvider";
import {actionTypes} from "../reducer";

export default function CheckoutCard({product: {id, name, productType, image, price, description, quantity}}) {
  const [state, dispatch] = useStateValue();
  const {basket} = state;


  const addToBasket = () => {
    dispatch({
      type: actionTypes.ADD_TO_BASKET,
      item:{
        id,
        name,
        productType,
        image, 
        price,
        description,
        quantity
      }

    })
  }

  const removeItem = (id) => {dispatch({
    type: actionTypes.REMOVE_ONE_FROM_BASKET,
    id: id,
    
  });

}
  const removeAllEqualItems = (id) => {dispatch({
    type: actionTypes.REMOVE_ALL,
    id: id,
    
  });

  
  }
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
          <DeleteIcon fontSize='large' onClick={()=>removeAllEqualItems(id)} />
        </IconButton>
        <IconButton aria-label="Add circle Icon" >
          <AddCircleIcon fontSize='large' onClick={addToBasket} />
        </IconButton>
        <Typography style={{fontWeight:"bold"}}>
          {quantity} unidades
        </Typography>
        <IconButton aria-label="Remove circle Icon" >
        <RemoveCircleOutlineIcon fontSize="large" onClick={()=>removeItem(id)}/>
        </IconButton>
      </CardActions>
    </Card>
  );
}
