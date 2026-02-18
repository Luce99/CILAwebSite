import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageCarousel from "../ImageCarousel";

const MOCK_IMAGES = ["/img1.png", "/img2.png", "/img3.png"];

describe("ImageCarousel", () => {
  it("renderiza la primera imagen por defecto", () => {
    render(<ImageCarousel images={MOCK_IMAGES} altText="Producto" />);

    const img = screen.getByAltText("Producto");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("img1.png");
  });

  it("muestra flechas de navegación cuando hay múltiples imágenes", () => {
    render(<ImageCarousel images={MOCK_IMAGES} altText="Test" />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("no muestra flechas con una sola imagen", () => {
    render(<ImageCarousel images={["/single.png"]} altText="Test" />);

    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(0);
  });

  it("navega a la siguiente imagen al hacer clic en flecha derecha", () => {
    render(<ImageCarousel images={MOCK_IMAGES} altText="Producto" />);

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];
    fireEvent.click(nextButton);

    const img = screen.getByAltText("Producto");
    expect(img.src).toContain("img2.png");
  });

  it("navega a la imagen anterior al hacer clic en flecha izquierda", () => {
    render(<ImageCarousel images={MOCK_IMAGES} altText="Producto" />);

    const buttons = screen.getAllByRole("button");
    const prevButton = buttons[0];
    fireEvent.click(prevButton);

    const img = screen.getByAltText("Producto");
    expect(img.src).toContain("img3.png");
  });

  it("vuelve a la primera imagen al pasar de la última con flecha derecha", () => {
    render(<ImageCarousel images={MOCK_IMAGES} altText="Producto" />);

    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[1];
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);

    const img = screen.getByAltText("Producto");
    expect(img.src).toContain("img1.png");
  });

  it("usa alt text por defecto si no se proporciona", () => {
    render(<ImageCarousel images={MOCK_IMAGES} />);

    const img = screen.getByAltText("Producto");
    expect(img).toBeInTheDocument();
  });

  it("maneja arreglo de imágenes vacío sin error", () => {
    render(<ImageCarousel images={[]} altText="Vacío" />);

    const img = screen.getByAltText("Vacío");
    expect(img).toBeInTheDocument();
    expect(img.src).toBe("http://localhost/");
  });
});
