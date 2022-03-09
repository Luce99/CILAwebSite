
import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Product from './Components/Product'
import Products from './Components/Products';
import CheckoutPage from './Components/CheckoutPage';

function App() {
  return (
    <div className="App">
      <Navbar/>
       {/* <Products/>  */}
       <CheckoutPage/>
    </div>
  );
}

export default App;
