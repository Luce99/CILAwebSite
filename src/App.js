import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Caoticas from './Components/Caoticas';
import Footer from './Components/Footer';
import CheckoutPage from './Components/CheckoutPage';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import { Fragment } from 'react';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Checkout from './Components/CheckOutForm/Checkout';
import Encantadoras from './Components/Encantadoras';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './apolloClient';
import AccountPage from './Components/AccountPage';
import NavAdministrador from './Components/Administration/NavAdministrador';
import Users from './Components/Administration/Users';
import PaymentResult from './Components/PaymentResult';

const ROUTER_BASENAME = process.env.PUBLIC_URL || "";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router basename={ROUTER_BASENAME}>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/carritoDeCompras" element={<CheckoutPage />} />
            <Route exact path="/checkout" element={<Checkout />} />
            <Route exact path="/payment/result" element={<PaymentResult />} />
            <Route exact path="/caoticas" element={<Caoticas />} />
            <Route exact path="/encantadoras" element={<Encantadoras />} />
            <Route exact path="/accountPage" element={<AccountPage />} />
            <Route exact path="/admistracion" element={<NavAdministrador />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/" element={<HomePage />} />
          </Routes>
          <Footer />
        </Fragment>
      </Router>
    </ApolloProvider>
  );
}

export default App;
