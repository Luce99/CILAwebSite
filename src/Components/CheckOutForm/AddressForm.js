import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const ADDRESS_FIELDS = [
  { id: "firstName", label: "Nombre", required: true, sm: 6 },
  { id: "lastName", label: "Apellido", required: true, sm: 6 },
  { id: "address1", label: "Dirección línea 1", required: true, sm: 12 },
  { id: "address2", label: "Dirección línea 2 (opcional)", required: false, sm: 12 },
  { id: "city", label: "Ciudad", required: true, sm: 6 },
  { id: "state", label: "Departamento / Provincia", required: false, sm: 6 },
  { id: "zip", label: "Código postal", required: true, sm: 6 },
  { id: "country", label: "País", required: true, sm: 6 },
];

function AddressField({ field, value, onChange }) {
  function handleChange(event) {
    onChange(field.id, event.target.value);
  }

  return (
    <Grid item xs={12} sm={field.sm}>
      <TextField
        required={field.required}
        id={field.id}
        name={field.id}
        label={field.label}
        fullWidth
        variant="standard"
        value={value}
        onChange={handleChange}
      />
    </Grid>
  );
}

export default function AddressForm({ addressData, onAddressChange }) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Dirección de envío
      </Typography>
      <Grid container spacing={3}>
        {ADDRESS_FIELDS.map((field) => (
          <AddressField
            key={field.id}
            field={field}
            value={addressData[field.id] || ""}
            onChange={onAddressChange}
          />
        ))}
      </Grid>
    </React.Fragment>
  );
}
