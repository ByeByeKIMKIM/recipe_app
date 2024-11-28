import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RecipeList from '../components/RecipeList';

const RecipeDetails: React.FC = () => {
  const location = useLocation();
  const {recipeTitle} = location.state as { recipeTitle: string };
  const {recipeIngredients} = location.state as { recipeIngredients: string };
  const {recipeInstructions} = location.state as { recipeInstructions: string };


  const handleRemake = async() => {
    const title = recipeTitle;
    const ingredients = recipeIngredients;
    const instructions = recipeInstructions;

    const edits = prompt('Please specify your remake')
    const specificTitle = "This is the title of the dish: " + title
    const specificIngredients = " These are the ingredients of the dish: " + ingredients
    const specificInstructions = " These are the instructions of the dish " + instructions +" "

    const content = specificTitle+specificIngredients+specificInstructions + edits;

    try {
       const response = await axios.post('http://localhost:8080/gpt', {
        content: content,
      });
      console.log(response.data);
      alert(response.data.content);

    } catch (error) {
      console.error('Error remaking recipe:', error);
    }
  }

  return (
    <div className="recipe-details">
      <h2>Recipe Details</h2>
      <p>{recipeTitle}</p>
      <p>{recipeIngredients}</p>
      <p>{recipeInstructions}</p>
      <button onClick = {handleRemake}>Remake</button>
    </div>
  );
};

export default RecipeDetails;
