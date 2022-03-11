import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Products from './Components/Products';
import CheckoutPage from './Components/CheckoutPage';
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import { Fragment } from 'react';

function App() {
  return (
    <Router>
      <Fragment>
      <Navbar/>
        <Routes>
        <Route exact path= "/carritoDeCompras" element={<CheckoutPage/>}/>
        <Route exact path="/tienda" element={<Products/>}/>
        <Route exact path="/" element={<HomePage/>}/>
        </Routes>
        </Fragment>
    </Router>
  );
}

export default App;
