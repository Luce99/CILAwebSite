import React from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { PAYMENT_RESULT_STATUS, PAYMENT_RESULT_MESSAGES } from "../constants/checkoutSteps";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

const theme = createTheme();

const STATUS_ICONS = {
  [PAYMENT_RESULT_STATUS.APPROVED]: <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "success.main" }} />,
  [PAYMENT_RESULT_STATUS.PENDING]: <HourglassEmptyIcon sx={{ fontSize: 80, color: "warning.main" }} />,
  [PAYMENT_RESULT_STATUS.REJECTED]: <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main" }} />,
};

const DEFAULT_RESULT = {
  title: "Estado desconocido",
  message: "No pudimos determinar el estado de tu pago. Contacta a soporte.",
};

function getResultContent(status) {
  return PAYMENT_RESULT_MESSAGES[status] || DEFAULT_RESULT;
}

function getStatusIcon(status) {
  return STATUS_ICONS[status] || STATUS_ICONS[PAYMENT_RESULT_STATUS.PENDING];
}

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const [, dispatch] = useStateValue();

  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");
  const resultContent = getResultContent(status);
  const statusIcon = getStatusIcon(status);

  React.useEffect(() => {
    if (status === PAYMENT_RESULT_STATUS.APPROVED) {
      dispatch({ type: actionTypes.PLACE_ORDER_SUCCESS });
    }
  }, [status, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Box sx={{ textAlign: "center", py: 3 }}>
            {statusIcon}
            <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
              {resultContent.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {resultContent.message}
            </Typography>

            {paymentId && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                ID de pago: {paymentId}
              </Typography>
            )}

            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              sx={{ mt: 2 }}
            >
              Volver al inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
