import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Caoticas from './Components/Caoticas';
import Footer from './Components/Footer';
import CheckoutPage from './Components/CheckoutPage';
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import { Fragment} from 'react';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp"
import Checkout from './Components/CheckOutForm/Checkout';
import Encantadoras from './Components/Encantadoras';
import { ApolloProvider } from '@apollo/client';
import AccountPage from './Components/AccountPage';

function App() {

  return (
    <ApolloProvider>
    <Router>
      <Fragment>
      <Navbar/>
        <Routes>
        <Route exact path= "/signin" element={<SignIn/>}/>
        <Route exact path= "/signup" element={<SignUp/>}/>
        <Route exact path= "/carritoDeCompras" element={<CheckoutPage/>}/>
        <Route exact path="/checkout" element={<Checkout/>}/>
        <Route exact path="/caoticas" element={<Caoticas/>}/>
        <Route exact path="/encantadoras" element={<Encantadoras/>}/>
        <Route exact path="/accountPage" element={<AccountPage/>}/>
        <Route exact path="/" element={<HomePage/>}/>
        </Routes>
        <Footer/>
        </Fragment>
    </Router>
    </ApolloProvider>
  );
}

export default App;
