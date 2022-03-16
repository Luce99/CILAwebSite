import React from "react";
import accounting from "accounting";
import { Button } from "@material-ui/core";
import { makeStyles} from "@mui/styles";
import {useStateValue} from "../StateProvider";
import {actionTypes} from "../reducer";
import { getBasketTotal } from "../reducer";
import { getItemsTotal } from "../reducer";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme)=>({
root:{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "20vh",
    justifyContent: "space-between"
}
}))



export default function Total() {
    const classes = useStyles()
    const [state, dispatch] = useStateValue();
    const {basket} = state;

const clearCart = () => {dispatch({
    type: actionTypes.CLEAR_CART
        
      });
    }

    return (
        <div className={classes.root}>
            <Button variant="contained" onClick={clearCart} style ={{color: "black",
    backgroundColor: "aqua",
    fontSize: "15px",
    fontWeight:"bold",
    boxShadow: "10px 5px 5px #09b588",
    textShadow:  "0.2em 0.2em white"}}>Limpiar carrito</Button>
            <h5> Total items: {getItemsTotal(basket)}</h5>
            <h5> {accounting.formatMoney(getBasketTotal(basket), "$", "cop")} </h5>
            <Link to="/checkout" style={{ color: "inherit", textDecoration: "inherit" }}><Button variant="contained" style ={{color: "black",
    backgroundColor: "aqua",
    fontSize: "15px",
    fontWeight:"bold",
    boxShadow: "10px 5px 5px #09b588",
    textShadow:  "0.2em 0.2em white"}}>Check Out</Button></Link>
        </div>

    );
}
