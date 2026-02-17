import React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import accounting from "accounting";

const SHIPPING_LABEL = "Envío";
const SHIPPING_COST_LABEL = "Gratis";

function OrderItemRow({ item }) {
  const formattedPrice = accounting.formatMoney(
    item.price * item.quantity,
    "$",
    "cop"
  );

  return (
    <ListItem sx={{ py: 1, px: 0 }}>
      <ListItemText
        primary={item.name}
        secondary={`Cantidad: ${item.quantity}`}
      />
      <Typography variant="body2">{formattedPrice}</Typography>
    </ListItem>
  );
}

function OrderTotalRow({ total }) {
  const formattedTotal = accounting.formatMoney(total, "$", "cop");

  return (
    <ListItem sx={{ py: 1, px: 0 }}>
      <ListItemText primary="Total" />
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {formattedTotal}
      </Typography>
    </ListItem>
  );
}

function ShippingRow() {
  return (
    <ListItem sx={{ py: 1, px: 0 }}>
      <ListItemText primary={SHIPPING_LABEL} />
      <Typography variant="body2">{SHIPPING_COST_LABEL}</Typography>
    </ListItem>
  );
}

function ShippingDetails({ shippingAddress }) {
  if (!shippingAddress) {
    return null;
  }

  const fullName = `${shippingAddress.firstName} ${shippingAddress.lastName}`;
  const addressParts = [
    shippingAddress.address1,
    shippingAddress.address2,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.zip,
    shippingAddress.country,
  ].filter(Boolean);

  return (
    <Grid item xs={12} sm={6}>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Dirección de envío
      </Typography>
      <Typography gutterBottom>{fullName}</Typography>
      <Typography gutterBottom>{addressParts.join(", ")}</Typography>
    </Grid>
  );
}

export default function Review({ cartItems, shippingAddress, basketTotal }) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Resumen del pedido
      </Typography>
      <List disablePadding>
        {cartItems.map((item) => (
          <OrderItemRow key={item.id} item={item} />
        ))}
        <ShippingRow />
        <OrderTotalRow total={basketTotal} />
      </List>
      <Grid container spacing={2}>
        <ShippingDetails shippingAddress={shippingAddress} />
      </Grid>
    </React.Fragment>
  );
}
