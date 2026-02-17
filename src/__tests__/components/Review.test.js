import React from "react";
import { render, screen } from "@testing-library/react";
import Review from "../../Components/CheckOutForm/Review";

const MOCK_CART_ITEMS = [
  { id: "1", name: "Blusa CILA", price: 50000, quantity: 2 },
  { id: "2", name: "Falda Encantadora", price: 60000, quantity: 1 },
];

const MOCK_ADDRESS = {
  firstName: "Laura",
  lastName: "Garcia",
  address1: "Carrera 45 #12-34",
  address2: "Apto 301",
  city: "Bogota",
  state: "Cundinamarca",
  zip: "110111",
  country: "Colombia",
};

describe("Review", () => {
  it("debe mostrar el titulo de resumen del pedido", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Resumen del pedido")).toBeInTheDocument();
  });

  it("debe mostrar los nombres de los productos", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Blusa CILA")).toBeInTheDocument();
    expect(screen.getByText("Falda Encantadora")).toBeInTheDocument();
  });

  it("debe mostrar la cantidad de cada producto", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("debe mostrar el envio como gratis", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Gratis")).toBeInTheDocument();
  });

  it("debe mostrar el nombre completo de la direccion de envio", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Laura Garcia")).toBeInTheDocument();
  });

  it("debe mostrar la seccion de direccion de envio", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={MOCK_ADDRESS} basketTotal={160000} />
    );

    expect(screen.getByText("Dirección de envío")).toBeInTheDocument();
  });

  it("no debe mostrar la seccion de envio si no hay direccion", () => {
    render(
      <Review cartItems={MOCK_CART_ITEMS} shippingAddress={null} basketTotal={160000} />
    );

    expect(screen.queryByText("Laura Garcia")).not.toBeInTheDocument();
  });
});
