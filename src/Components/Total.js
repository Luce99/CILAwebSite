import React from "react";
import accounting from "accounting";
import { Button } from "@material-ui/core";
import { makeStyles, withThemeCreator } from "@mui/styles";

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


const Total = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <h5> Total items: 3</h5>
            <h5> {accounting.formatMoney(50000, "$", "cop")} </h5>
            <Button variant="contained" style ={{color: "black",
    backgroundColor: "aqua",
    fontSize: "15px",
    fontWeight:"bold",
    textShadow:  "0.2em 0.2em white"}}>Check Out</Button>
        </div>

    )
}

export default Total;