import "./App.css";
import HomePage from "./Components/HomePage";
import Navbar from "./Components/Navbar";
import CategoryPage from "./Components/CategoryPage";
import Footer from "./Components/Footer";
import CheckoutPage from "./Components/CheckoutPage";
import { Routes, BrowserRouter as Router, Route, Navigate } from "react-router-dom";
import { Fragment } from "react";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Checkout from "./Components/CheckOutForm/Checkout";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apolloClient";
import AccountPage from "./Components/AccountPage";
import Users from "./Components/Administration/Users";
import ProductManagement from "./Components/Administration/ProductManagement";
import PendingApprovals from "./Components/Administration/PendingApprovals";
import MyProposals from "./Components/Administration/MyProposals";
import PaymentResult from "./Components/PaymentResult";

const ROUTER_BASENAME = process.env.PUBLIC_URL || "";

function AppRoutes() {
  return (
    <Router basename={ROUTER_BASENAME}>
      <Fragment>
        <Navbar />
        <Routes>
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/carritoDeCompras" element={<CheckoutPage />} />
          <Route exact path="/checkout" element={<Checkout />} />
          <Route exact path="/payment/result" element={<PaymentResult />} />
          <Route exact path="/categoria/:categoryName" element={<CategoryPage />} />
          <Route exact path="/accountPage" element={<AccountPage />} />
          <Route exact path="/administracion" element={<Navigate to="/administracion/productos" replace />} />
          <Route exact path="/administracion/productos" element={<ProductManagement />} />
          <Route exact path="/administracion/usuarios" element={<Users />} />
          <Route exact path="/administracion/aprobaciones" element={<PendingApprovals />} />
          <Route exact path="/administracion/mis-propuestas" element={<MyProposals />} />
          <Route exact path="/administracion/ventas" element={<Users />} />
          <Route exact path="/users" element={<Navigate to="/administracion/usuarios" replace />} />
          <Route exact path="/admistracion" element={<Navigate to="/administracion/productos" replace />} />
          <Route exact path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </Fragment>
    </Router>
  );
}

function ApolloClientWarning() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Error de conexión</h2>
      <p>
        No se pudo inicializar la conexión con el servidor. Por favor, recarga
        la página o intenta más tarde.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "0.5rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        Recargar
      </button>
    </div>
  );
}

function App() {
  const hasClient = Boolean(apolloClient);
  if (hasClient === false) {
    return <ApolloClientWarning />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AppRoutes />
    </ApolloProvider>
  );
}

export default App;
