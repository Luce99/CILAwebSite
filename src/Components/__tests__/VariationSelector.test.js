import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VariationSelector from "../VariationSelector";

const MOCK_COLORS = ["Blanco", "Negro", "Rosa"];
const MOCK_SIZES = ["S", "M", "L", "XL"];

describe("VariationSelector", () => {
  it("renderiza chips de colores", () => {
    render(
      <VariationSelector
        colors={MOCK_COLORS}
        sizes={[]}
        selectedColor="Blanco"
        selectedSize=""
        onColorChange={jest.fn()}
        onSizeChange={jest.fn()}
      />
    );

    expect(screen.getByText("Blanco")).toBeInTheDocument();
    expect(screen.getByText("Negro")).toBeInTheDocument();
    expect(screen.getByText("Rosa")).toBeInTheDocument();
  });

  it("renderiza chips de tallas", () => {
    render(
      <VariationSelector
        colors={[]}
        sizes={MOCK_SIZES}
        selectedColor=""
        selectedSize="M"
        onColorChange={jest.fn()}
        onSizeChange={jest.fn()}
      />
    );

    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("L")).toBeInTheDocument();
    expect(screen.getByText("XL")).toBeInTheDocument();
  });

  it("llama onColorChange al seleccionar un color", () => {
    const onColorChange = jest.fn();
    render(
      <VariationSelector
        colors={MOCK_COLORS}
        sizes={[]}
        selectedColor="Blanco"
        selectedSize=""
        onColorChange={onColorChange}
        onSizeChange={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Negro"));
    expect(onColorChange).toHaveBeenCalledWith("Negro");
  });

  it("llama onSizeChange al seleccionar una talla", () => {
    const onSizeChange = jest.fn();
    render(
      <VariationSelector
        colors={[]}
        sizes={MOCK_SIZES}
        selectedColor=""
        selectedSize="S"
        onColorChange={jest.fn()}
        onSizeChange={onSizeChange}
      />
    );

    fireEvent.click(screen.getByText("L"));
    expect(onSizeChange).toHaveBeenCalledWith("L");
  });

  it("no renderiza nada si no hay colores ni tallas", () => {
    const { container } = render(
      <VariationSelector
        colors={[]}
        sizes={[]}
        selectedColor=""
        selectedSize=""
        onColorChange={jest.fn()}
        onSizeChange={jest.fn()}
      />
    );

    expect(screen.queryByText("Color")).not.toBeInTheDocument();
    expect(screen.queryByText("Talla")).not.toBeInTheDocument();
  });

  it("muestra el label 'Color' cuando hay colores", () => {
    render(
      <VariationSelector
        colors={MOCK_COLORS}
        sizes={[]}
        selectedColor="Blanco"
        selectedSize=""
        onColorChange={jest.fn()}
        onSizeChange={jest.fn()}
      />
    );

    expect(screen.getByText("Color")).toBeInTheDocument();
  });

  it("muestra el label 'Talla' cuando hay tallas", () => {
    render(
      <VariationSelector
        colors={[]}
        sizes={MOCK_SIZES}
        selectedColor=""
        selectedSize="M"
        onColorChange={jest.fn()}
        onSizeChange={jest.fn()}
      />
    );

    expect(screen.getByText("Talla")).toBeInTheDocument();
  });
});
