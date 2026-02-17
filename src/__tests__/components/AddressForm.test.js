import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddressForm from "../../Components/CheckOutForm/AddressForm";
import { EMPTY_ADDRESS } from "../../constants/checkoutSteps";

describe("AddressForm", () => {
  const mockOnAddressChange = jest.fn();

  beforeEach(() => {
    mockOnAddressChange.mockClear();
  });

  it("debe renderizar todos los campos del formulario", () => {
    render(
      <AddressForm addressData={EMPTY_ADDRESS} onAddressChange={mockOnAddressChange} />
    );

    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apellido/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ciudad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/País/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Código postal/i)).toBeInTheDocument();
  });

  it("debe mostrar el titulo de la seccion", () => {
    render(
      <AddressForm addressData={EMPTY_ADDRESS} onAddressChange={mockOnAddressChange} />
    );

    expect(screen.getByText("Dirección de envío")).toBeInTheDocument();
  });

  it("debe mostrar los valores iniciales de la direccion", () => {
    const addressWithData = {
      ...EMPTY_ADDRESS,
      firstName: "Maria",
      city: "Bogota",
    };

    render(
      <AddressForm addressData={addressWithData} onAddressChange={mockOnAddressChange} />
    );

    expect(screen.getByDisplayValue("Maria")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bogota")).toBeInTheDocument();
  });

  it("debe llamar onAddressChange al modificar un campo", () => {
    render(
      <AddressForm addressData={EMPTY_ADDRESS} onAddressChange={mockOnAddressChange} />
    );

    const firstNameInput = screen.getByLabelText(/Nombre/i);
    fireEvent.change(firstNameInput, { target: { value: "Carlos" } });

    expect(mockOnAddressChange).toHaveBeenCalledWith("firstName", "Carlos");
  });
});
