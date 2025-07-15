import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { FiArrowLeft } from 'react-icons/fi';
import './Styles/recipeDetails.css';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const recipeDocRef = doc(db, 'recipes', id);
        const recipeDoc = await getDoc(recipeDocRef);
        if (recipeDoc.exists()) {
          setRecipe({ id: recipeDoc.id, ...recipeDoc.data() });
        } else {
          setError('Recipe not found.');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <div className="rd-recipe-details-container">
      {loading ? (
        <div className="rd-loading-spinner">
          <div className="rd-spinner"></div>
          <p>Loading recipe...</p>
        </div>
      ) : error ? (
        <p className="rd-error-message">{error}</p>
      ) : recipe ? (
        <div className="rd-content-wrapper">
          {/* Left Section */}
          
          <div className="rd-left-section">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="rd-recipe-image"
              loading="lazy"
            />
          <h1 className="rd-recipe-title">{recipe.name}</h1>  
              <h1 className="rd-section-title">Description</h1>
              <p className="rd-recipe-description">{recipe.description}</p>
            
             <p className="rd-recipe-author">By {recipe.userName}</p>
          </div>

          {/* Right Section */}
          <div className="rd-right-section">
             <div className='rd-ingredients-section'>
              <h1 className="rd-section-title">Ingredients</h1>
              <ul className="rd-ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="rd-ingredient-item">
                    {ingredient}
                  </li>
                ))}
              </ul>
             </div>


            <div className="rd-steps-section">
              <h1 className="rd-section-title">Steps</h1>
              <ol className="rd-steps-list">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="rd-step-item">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

           <button className="rd-back-button" onClick={() => navigate('/main')}>
              <FiArrowLeft className="rd-back-icon" />
              Back to Home
            </button>  
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecipeDetails;
