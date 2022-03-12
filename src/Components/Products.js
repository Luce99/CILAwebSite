import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Product from './Product';
import products from "./product-data";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Products() {
  return (
    <div>
      <Grid container spacing={2}>
       <Grid item xs={12}>
    <h1>PRODUCTOS</h1>
    </Grid>
    </Grid>
    <Box sx={{ flexGrow: 1 }} className="contenedor" >
      
      <Grid container spacing={2} className="products">
          { 
              products.map(product =>(
                <Grid  key={product.id} item xs={6} sm={5} md={4} lg={4}>
                  <div className='producto'>
                     <Product key={product.id} product={product} />
                    </div>
                </Grid>
              ))
          }
      </Grid>
    </Box>
    </div>
  );
}
