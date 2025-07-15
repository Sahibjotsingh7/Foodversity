import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Add Link for navigation
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Styles/exploreRecipes.css';

const ExploreRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch recipes from Firestore
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
        setFilteredRecipes(recipesData);
        console.log('Fetched recipes:', recipesData);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  useEffect(() => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="explore-recipes">
      {/* Professional Heading */}
      <h1 className="explore-recipes-heading">
        Explore Our Amazing Recipes for Cooking Healthy & Delicious Food
      </h1>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes by name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="recipe-grid">
        {loading ? (
          <p className="loading-message">Loading recipes...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="recipe-card-link">
              <div className="recipe-card">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  className="recipe-image"
                  loading="lazy"
                />
                <div className="recipe-details">
                  <h2 className="recipe-title" style={{textDecoration:"none"}}>{recipe.name}</h2>
                  <p className="recipe-description">
                    {recipe.description.length > 100
                      ? `${recipe.description.substring(0, 100)}...`
                      : recipe.description}
                  </p>
                  
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="no-recipes-message">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default ExploreRecipes;