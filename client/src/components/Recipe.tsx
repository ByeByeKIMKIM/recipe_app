import React from 'react';
import '../styles/Recipe.css'
import axios from 'axios';
import {useAuth} from '../auth/AuthUserProvider.tsx';
import { useNavigate } from 'react-router-dom';

interface RecipeProps {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  userId: string;
}

const Recipe: React.FC<RecipeProps> = ({id, title, ingredients, instructions, userId}) => {

  const {user} = useAuth();
  const uniqueUserId = user?.uid;

  const navigate = useNavigate();

  // const handleRemake = async() => {
  //   const recipeTitle = title;
  //   const recipeIngredients = ingredients;

  //   const content = "The dish I'm trying to make is " + recipeTitle + " and these are the ingredients: " + recipeIngredients;

  //   try {
  //      const response = await axios.post('http://localhost:8080/gpt', {
  //       content: content,
  //     });
  //     console.log(response.data);
  //     alert(response.data.content);

  //   } catch (error) {
  //     console.error('Error remaking recipe:', error);
  //   }
  // }

  const handleDelete = async () => {
    if(uniqueUserId != userId) {
      alert("Cannot delete: not authorized")
      return;
    }
    const recipeId = id;
    try {
      await axios.delete(`http://localhost:8080/deleteRecipe/${recipeId}`);
      alert('Recipe deleted successfully!');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleEdit = async() => {
    if(uniqueUserId != userId) {
      alert("Cannot edit: not authorized")
      return;
    }

    const recipeId = id;

    const currentTitle = title;
    const newTitle = prompt('Edit the title', currentTitle);

    const currentIngredients = ingredients;
    const newIngredients = prompt('Edit the ingredients', currentIngredients)

    const currentInstructions = instructions;
    const newInstructions = prompt('Edit the instructions', currentInstructions)

    try {
      await axios.put(`http://localhost:8080/changeRecipe/${recipeId}`, {
        newTitle: newTitle,
        newIngredients: newIngredients,
        newInstructions: newInstructions,
      });
      console.log('edited the doc')
    } catch (error) {
      console.error('An error occured' + error)
    }
  }
  
  const handleRemake = async() => {
    navigate('/recipe-details', { state: { recipeTitle: title, recipeIngredients: ingredients, recipeInstructions: instructions } });  
  }



  return (
    <div className="recipe">
      <h2>{title}</h2>
      <p>Ingredients: {ingredients}</p>
      <p>Instructions: {instructions}</p>
      <button onClick={handleRemake} className="gradient-button">Remake</button>
      <button onClick={handleDelete}>X</button>
      <button onClick={handleEdit}>edit</button>
    </div>
  );
};

export default Recipe;
