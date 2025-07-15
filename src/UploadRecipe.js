
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { RxCross2 } from 'react-icons/rx';
import './Styles/upload.css';
import {Link} from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";


const UploadRecipe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const REACT_APP_IMGBB_API_KEY = "704b89f6d1ccd5160fbe0129a4f10f8c";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        setError('Image size must be less than 5 MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Image must be JPG or PNG.');
        return;
      }
      setImage(file);
    }
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const removeStepField = (index) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to upload a recipe.');
      return;
    }
    if (
      !name ||
      !description ||
      ingredients.some((ing) => !ing.trim()) ||
      steps.some((step) => !step.trim()) ||
      !image
    ) {
      setError('Please fill in all required fields and select an image.');
      return;
    }

    setLoading(true);
    try {
      // Validate ImgBB API key
      const imgbbApiKey = REACT_APP_IMGBB_API_KEY;
      if (!imgbbApiKey) {
        throw new Error('ImgBB API key is missing. Check .env file for REACT_APP_IMGBB_API_KEY.');
      }

      // Upload image to ImgBB with retry
      const uploadImageWithRetry = async (retries = 2) => {
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        imageFormData.append('key', imgbbApiKey);

        console.log('Uploading image:', image.name, image.type, image.size);
        for (let i = 0; i <= retries; i++) {
          try {
            const imageResponse = await fetch('https://api.imgbb.com/1/upload', {
              method: 'POST',
              body: imageFormData,
            });
            const imageData = await imageResponse.json();
            console.log('Image upload response:', imageData);

            if (!imageResponse.ok || !imageData.success) {
              throw new Error(imageData.error?.message || 'Image upload to ImgBB failed');
            }
            return imageData.data.url;
          } catch (err) {
            if (i === retries) throw err;
            console.log(`Retrying image upload (${i + 1}/${retries})...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
          }
        }
      };

      const imageUrl = await uploadImageWithRetry();

      // Save recipe to Firestore
      const recipeId = Date.now().toString();
      const recipeDocRef = doc(db, 'recipes', recipeId);
      await setDoc(recipeDocRef, {
        name,
        description,
        ingredients: ingredients.filter((ing) => ing.trim()),
        steps: steps.filter((step) => step.trim()),
        imageUrl,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Anonymous',
        createdAt: new Date().toISOString(),
      });

      navigate('/main');
    } catch (err) {
      console.error('Upload error:', err);
      if (err.message.includes('ImgBB API key')) {
        setError(err.message);
      } else if (err.message.includes('Image upload to ImgBB')) {
        setError(`Failed to upload image to ImgBB: ${err.message}`);
      } else if (err.code === 'firestore/permission-denied') {
        setError('Firestore permission denied. Please check your Firebase rules.');
      } else {
        setError(`Failed to upload recipe: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="banner-container">
        <div className="banner-text">
          <h1 className="banner-title">Upload Your Recipe</h1>
          <p className="banner-subtitle">Share your culinary creation with Foodversity</p>
          <Link to="/dashboard" className='banner-link' >
            <button  className="banner-button">Manage Recipes  <FaArrowRight /></button>
          </Link>
        </div>
        <img
          src="https://samsungfood.com/wp-content/cache/thumb/3c/def98820344fe3c_600x520.jpeg"
          srcSet="https://samsungfood.com/wp-content/themes/whisk/assets/img/mp_hero.jpeg 2x"
          alt="Meal planner banner"
          className="banner-image"
        />
      </div>
      <div className="upload-box">
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="name">Recipe Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter recipe name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your recipe"
              rows="4"
              required
            />
          </div>
          <div className="form-group">
            <label>Ingredients *</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-group">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    className="remove-ingredient-button"
                    onClick={() => removeIngredientField(index)}
                  >
                    <RxCross2 />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-ingredient-button"
              onClick={addIngredientField}
            >
              Add Ingredient
            </button>
          </div>
          <div className="form-group">
            <label>Steps *</label>
            {steps.map((step, index) => (
              <div key={index} className="step-group">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    className="remove-step-button"
                    onClick={() => removeStepField(index)}
                  >
                    <RxCross2 />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-step-button"
              onClick={addStepField}
            >
              Add Step
            </button>
          </div>
          <div className="form-group">
            <label htmlFor="image">Recipe Image *</label>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadRecipe;