import React from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { MP_PUBLIC_KEY } from "../../constants/apiEndpoints";

const MP_LOCALE = "es-CO";

initMercadoPago(MP_PUBLIC_KEY, { locale: MP_LOCALE });

function LoadingIndicator() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
      <CircularProgress />
    </Box>
  );
}

export default function MercadoPagoButton({ preferenceId }) {
  if (!preferenceId) {
    return (
      <Typography variant="body1" align="center" color="error">
        No se pudo generar la preferencia de pago. Intenta nuevamente.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Completa tu pago con MercadoPago
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 2 }} color="text.secondary">
        Serás redirigido a MercadoPago para completar el pago de forma segura.
      </Typography>
      <Wallet
        initialization={{ preferenceId, redirectMode: "self" }}
        onReady={() => {}}
        onError={(error) => console.error("Error en Wallet MP:", error)}
        onSubmit={() => {}}
        customization={{ texts: { valueProp: "smart_option" } }}
      />
    </Box>
  );
}
