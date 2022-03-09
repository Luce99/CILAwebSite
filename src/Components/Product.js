import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import accounting from 'accounting';
import * as image from "./images/index.js";



const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Product({product: {id, name, productType, image, price, description}}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(image);

  return (
    <Card sx={{ maxWidth: 400 , height: 600 , backgroundColor: "#09b588", color: "#ffffff" }} className="card">
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
      {/* <input type="button"  id="anterior" value="<<"/>
      <input type="button"  id="siguiente" value=">>"/> */}
      <CardContent >
          <Typography variant = 'body2'>
            {productType}
          </Typography>
      </CardContent>
      <CardActions disableSpacing color = "white">
        <IconButton aria-label="Add to Cart" >
          <AddShoppingCart fontSize='large' />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Descripción:</Typography>
          <Typography paragraph>{description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
