import * as React from "react";
import FotoHome from "./images/FotoHome.png";
import { Slideshow, Slide, TextoSlide } from "./Slideshow";
import { blusa, cila3, cila4, cila5, cila6 } from "../Components/images";
import { cila1 } from "../Components/images";
import { cila2 } from "../Components/images";
import { Link } from "react-router-dom";
import products from "./product-data";



export default function HomePage() {

// 	<Grid container spacing={2} className="products">
// 	{ 
// 		 newProducts.map(product =>(
// 		  <Grid  key={product.id} item xs={6} sm={5} md={4} lg={4}>
// 			<div className='producto'>
// 			   <Product key={product.id} product={product} />
// 			  </div>
// 		  </Grid>
// 		))
// 	}
// </Grid>
	// function link(product){
	// 	if (product.category === "Caóticas"){
	// 		return "/caoticas";
	// 	  } else {
	// 		return "/encantadoras";
	// 	  }
	// 	}
  return (
    <main>
      <div>
        <img src={FotoHome} width="100%" className="fotoHome"></img>
		</div>
		<h4>¿Quienes somos?</h4>
		<div className="contenedorDescripcion">
			
		<p className="descripcion">
        CILA auténticas es un distribuidor de ropa para chicas, nos dividimos en
        dos categorías que nos gusta llamar para chicas &nbsp;
        <a  href="/caoticas">
           caóticas &nbsp;
        </a>
        y para chicas &nbsp;
        <a href="/encantadoras">
           encantadoras, &nbsp;
        </a>
         somos una marca creada y administrada por mujeres jóvenes con mucha
        visión.
      </p>
      </div>
      <h1>Más vendidos</h1>
      <Slideshow
        controles={true}
        autoplay={true}
        velocidad="3000"
        intervalo="5000"
      >
        <Slide>
          <Link to="/encantadoras">
            <img src={blusa} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/encantadoras">
            <img src={cila1} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/encantadoras">
            <img src={cila2} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/caoticas">
            <img src={cila3} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/encantadoras">
            <img src={cila4} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/caoticas">
            <img src={cila5} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
        <Slide>
          <Link to="/encantadoras">
            <img src={cila6} alt="" />
          </Link>
          <TextoSlide>
            <p>¡HOT!</p>
          </TextoSlide>
        </Slide>
      </Slideshow>
    </main>
  );
}
