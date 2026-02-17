import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentResult from "../../Components/PaymentResult";
import { StateProvider } from "../../StateProvider";
import reducer, { initialState } from "../../reducer";

function renderWithProviders(route) {
  return render(
    <StateProvider InitialState={initialState} reducer={reducer}>
      <MemoryRouter initialEntries={[route]}>
        <PaymentResult />
      </MemoryRouter>
    </StateProvider>
  );
}

describe("PaymentResult", () => {
  it("debe mostrar mensaje de exito cuando el pago es aprobado", () => {
    renderWithProviders("/payment/result?status=approved");

    expect(screen.getByText(/Pago aprobado/i)).toBeInTheDocument();
  });

  it("debe mostrar mensaje pendiente cuando el pago esta en proceso", () => {
    renderWithProviders("/payment/result?status=pending");

    expect(screen.getByText(/Pago pendiente/i)).toBeInTheDocument();
  });

  it("debe mostrar mensaje de rechazo cuando el pago es rechazado", () => {
    renderWithProviders("/payment/result?status=rejected");

    expect(screen.getByText(/Pago rechazado/i)).toBeInTheDocument();
  });

  it("debe mostrar mensaje por defecto cuando el estado es desconocido", () => {
    renderWithProviders("/payment/result?status=unknown");

    expect(screen.getByText(/Estado desconocido/i)).toBeInTheDocument();
  });

  it("debe mostrar el ID de pago si esta presente", () => {
    renderWithProviders("/payment/result?status=approved&payment_id=12345");

    expect(screen.getByText(/12345/i)).toBeInTheDocument();
  });

  it("debe mostrar el boton de volver al inicio", () => {
    renderWithProviders("/payment/result?status=approved");

    expect(screen.getByText("Volver al inicio")).toBeInTheDocument();
  });
});
