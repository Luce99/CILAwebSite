import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CategoryPage from "../CategoryPage";
import { StateProvider } from "../../StateProvider";

function renderWithRoute(categoryName) {
  return render(
    <StateProvider>
      <MemoryRouter initialEntries={["/categoria/" + categoryName]}>
        <Routes>
          <Route path="/categoria/:categoryName" element={<CategoryPage />} />
        </Routes>
      </MemoryRouter>
    </StateProvider>
  );
}

describe("CategoryPage", () => {
  it("muestra el título de la categoría Tops", () => {
    renderWithRoute("tops");

    expect(screen.getByText("TOPS")).toBeInTheDocument();
  });

  it("muestra productos de la categoría Bottoms", () => {
    renderWithRoute("bottoms");

    expect(screen.getByText("BOTTOMS")).toBeInTheDocument();
  });

  it("muestra productos de la categoría Vestidos", () => {
    renderWithRoute("vestidos");

    expect(screen.getByText("VESTIDOS")).toBeInTheDocument();
  });

  it("muestra mensaje vacío para categoría sin productos", () => {
    renderWithRoute("inexistente");

    expect(
      screen.getByText(/No hay productos disponibles/)
    ).toBeInTheDocument();
  });

  it("renderiza tarjetas de producto con botón Agregar", () => {
    renderWithRoute("tops");

    const addButtons = screen.getAllByText("Agregar");
    expect(addButtons.length).toBeGreaterThan(0);
  });

  it("filtra correctamente los productos por nombre de categoría en URL", () => {
    renderWithRoute("novedades");

    expect(screen.getByText("NOVEDADES")).toBeInTheDocument();
    const addButtons = screen.getAllByText("Agregar");
    expect(addButtons.length).toBeGreaterThan(0);
  });
});
