import React, { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AddressForm from "./AddressForm";
import Review from "./Review";
import MercadoPagoButton from "./MercadoPagoButton";

import { useStateValue } from "../../StateProvider";
import { actionTypes, getBasketTotal } from "../../reducer";
import { createPaymentPreference } from "../../services/paymentService";
import { CHECKOUT_STEPS, STEP_INDEX, EMPTY_ADDRESS } from "../../constants/checkoutSteps";

const theme = createTheme();

const REQUIRED_ADDRESS_FIELDS = ["firstName", "lastName", "address1", "city", "zip", "country"];

function isAddressComplete(address) {
  return REQUIRED_ADDRESS_FIELDS.every((field) => {
    const value = address[field];
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

function StepContent({ activeStep, addressData, onAddressChange, cartItems, shippingAddress, basketTotal, preferenceId }) {
  if (activeStep === STEP_INDEX.ADDRESS) {
    return (
      <AddressForm
        addressData={addressData}
        onAddressChange={onAddressChange}
      />
    );
  }

  if (activeStep === STEP_INDEX.REVIEW) {
    return (
      <Review
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        basketTotal={basketTotal}
      />
    );
  }

  if (activeStep === STEP_INDEX.PAYMENT) {
    return <MercadoPagoButton preferenceId={preferenceId} />;
  }

  return null;
}

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(STEP_INDEX.ADDRESS);
  const [addressData, setAddressData] = useState({ ...EMPTY_ADDRESS });
  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [state, dispatch] = useStateValue();
  const { basket } = state;
  const basketTotal = getBasketTotal(basket);

  function handleAddressChange(fieldId, value) {
    setAddressData((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleBack() {
    setActiveStep((prev) => prev - 1);
    setErrorMessage(null);
  }

  async function handleNext() {
    setErrorMessage(null);

    if (activeStep === STEP_INDEX.ADDRESS) {
      if (!isAddressComplete(addressData)) {
        setErrorMessage("Por favor completa todos los campos obligatorios de la dirección");
        return;
      }
      dispatch({ type: actionTypes.SET_SHIPPING_ADDRESS, address: addressData });
      setActiveStep(STEP_INDEX.REVIEW);
      return;
    }

    if (activeStep === STEP_INDEX.REVIEW) {
      await handleCreatePreference();
      return;
    }
  }

  async function handleCreatePreference() {
    setIsLoading(true);
    try {
      const result = await createPaymentPreference(basket, addressData, null);
      setPreferenceId(result.preferenceId);
      dispatch({ type: actionTypes.SET_PREFERENCE_ID, preferenceId: result.preferenceId });
      setActiveStep(STEP_INDEX.PAYMENT);
    } catch (error) {
      setErrorMessage(error.message || "Error al procesar el pago. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function isNextButtonDisabled() {
    if (isLoading) {
      return true;
    }
    if (activeStep === STEP_INDEX.ADDRESS && !isAddressComplete(addressData)) {
      return true;
    }
    if (basket.length === 0) {
      return true;
    }
    return false;
  }

  function getNextButtonLabel() {
    if (activeStep === STEP_INDEX.REVIEW) {
      return "Proceder al pago";
    }
    return "Siguiente";
  }

  if (basket.length === 0 && activeStep !== STEP_INDEX.PAYMENT) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography variant="h5" align="center" gutterBottom>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body1" align="center">
              Agrega productos antes de continuar con el checkout.
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h2" variant="h4" align="center">
            Checkout
          </Typography>

          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {CHECKOUT_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <StepContent
            activeStep={activeStep}
            addressData={addressData}
            onAddressChange={handleAddressChange}
            cartItems={basket}
            shippingAddress={addressData}
            basketTotal={basketTotal}
            preferenceId={preferenceId}
          />

          {activeStep < STEP_INDEX.PAYMENT && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep !== STEP_INDEX.ADDRESS && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Atrás
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isNextButtonDisabled()}
                sx={{ mt: 3, ml: 1 }}
              >
                {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                {getNextButtonLabel()}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
