import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Caoticas from './Components/Caoticas';
import Dulces from './Components/Dulces';
import Footer from './Components/Footer';
import CheckoutPage from './Components/CheckoutPage';
import {Routes, BrowserRouter as Router, Route} from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp"
import { auth } from './Components/firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import Checkout from './Components/CheckOutForm/Checkout';

function App() {
  const [{user}, dispatch] = useStateValue();
  useEffect(()=>{
    auth.onAuthStateChanged((authUser)=>{
      console.log(authUser);
      if(authUser){
        dispatch({
          type: actionTypes.SET_USER,
          user: authUser,
        })
      }
    })
  },[])

  return (
    <Router>
      <Fragment>
      <Navbar/>
        <Routes>
        <Route exact path= "/signin" element={<SignIn/>}/>
        <Route exact path= "/signup" element={<SignUp/>}/>
        <Route exact path= "/carritoDeCompras" element={<CheckoutPage/>}/>
        <Route exact path="/checkout" element={<Checkout/>}/>
        <Route exact path="/caoticas" element={<Caoticas/>}/>
        <Route exact path="/dulces" element={<Dulces/>}/>
        <Route exact path="/" element={<HomePage/>}/>
        </Routes>
        <Footer/>
        </Fragment>
    </Router>
  );
}

export default App;
