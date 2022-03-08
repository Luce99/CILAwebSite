
import './App.css';
import HomePage from './Components/HomePage';
import Navbar from './Components/Navbar';
import Product from './Components/Product'
import Products from './Components/Products';

function App() {
  return (
    <div className="App">
      <Navbar/>
       <Products/> 
      {/* <Product/> */}
    </div>
  );
}

export default App;
