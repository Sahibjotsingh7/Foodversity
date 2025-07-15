import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { FiTrash2, FiLogOut } from 'react-icons/fi';
import './Styles/dashboard.css';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Fetch user's recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setError('You must be logged in to view your dashboard.');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, 'recipes'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const recipesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recipesData);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load your recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  // Handle recipe deletion
  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteDoc(doc(db, 'recipes', recipeId));
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      } catch (err) {
        console.error('Error deleting recipe:', err);
        setError('Failed to delete recipe. Please try again.');
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Banner */}
      <div className="banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1 className="banner-title">Welcome, {user?.displayName || 'User'}</h1>
            <p className="banner-email">{user?.email || ''}</p>
            <button className="logout-button" onClick={handleLogout}>
               Logout
              <FiLogOut className="logout-icon" />
             
            </button>
          </div>
          <div className="banner-right">
            <img src={ 'https://samsungfood.com/wp-content/uploads/2025/02/sat_hero_desk.png'} alt="User Avatar" className="user-avatar" />
          </div>
        </div>
      </div>

      {/* Your Recipes Section */}
      <div className="recipes-section">
        <h1 className="section-title" style={{color:"black" ,border:"none"}}>Your Recipes</h1>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p className="loading-message">Loading your recipes...</p>
        ) : recipes.length > 0 ? (
          <div className="recipe-list" style={{border:"none"}}>
            {recipes.map((recipe) => (
              <div key={recipe.id} className="dashboard-recipe-card">
                <div className="dashboard-recipe-info">
                  <h3 className="dashboard-recipe-name">{recipe.name}</h3>
                  <p className="dashboard-recipe-description">
                    {recipe.description.length > 100
                      ? `${recipe.description.substring(0, 100)}...`
                      : recipe.description}
                  </p>
                </div>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(recipe.id)}
                >
                  <FiTrash2 className="delete-icon" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-recipes-message">You haven't uploaded any recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
