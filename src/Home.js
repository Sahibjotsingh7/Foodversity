import React from 'react';
import './Styles/home.css';
import ExploreRecipes from './ExploreRecipes';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <section>
        <div className="hero-inner-wrapper">
          <div className="hero-cta-section">
            <h1 className="hero-title">
              Welcome to Foodversity <br></br> The Universe of Flavours
            </h1>
            <p className="hero-description">
              Share and discover delicious recipes from around the world. Upload
              your own recipes, watch cooking tutorials, and explore a diverse
              collection of dishes. let foodversity be your cooking master  
            </p>
            <div className="hero-button-container">
              <Link
                to="/upload"
                className="hero-button"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <div className="hero-image-container">
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="https://samsungfood.com/wp-content/uploads/2024/08/food_plus_hero_mobile.png"
              />
              <img
                className="hero-image"
                src="https://samsungfood.com/wp-content/cache/thumb/7d/00ccdbc14e4aa7d_821x656.png"
                alt="Zaikaverse hero"
              />
            </picture>
          </div>
        </div>
      </section>
      <ExploreRecipes></ExploreRecipes>
    </div>
  );
};

export default Home;
