import React from 'react';
import '../styles/Recipe.css'
import axios from 'axios';
import {useAuth} from '../auth/AuthUserProvider.tsx';
import { useNavigate } from 'react-router-dom';
import {getDocs, query, where, collection, getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion} from 'firebase/firestore'
import {app} from '../utils/firebase.ts'


interface RecipeProps {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  userId: string;
}

const Recipe: React.FC<RecipeProps> = ({id, title, ingredients, instructions, userId}) => {

  const db = getFirestore(app);

  const {user} = useAuth();
  const uniqueUserId = user?.uid;

  const navigate = useNavigate();

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
        userId: userId
      });
      console.log('edited the doc')
    } catch (error) {
      console.error('An error occured' + error)
    }
  }
  
  const handleRemake = async() => {
    navigate('/recipe-details', { state: { recipeTitle: title, recipeIngredients: ingredients, recipeInstructions: instructions } });  
  }

  const handleSave = async() => {
    if(!user) {
      alert("Please sign in to save");
    } else {
      // const db = getFirestore(app);
      const userDocRef = doc(db, "users", user.uid);

      try {
        // Check if the user document exists
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // User document exists, update the recipes array
          await updateDoc(userDocRef, {
            recipes: arrayUnion(id)
          });
        } else {
          // User document doesn't exist, create it with the recipes array
          await setDoc(userDocRef, {
            recipes: [id]
          });
        }

        console.log("Recipe saved successfully!");
      } catch (error) {
        console.error("Error saving recipe:", error);
        alert("An error occurred while saving the recipe. Please try again.");
      }
    }
  }
  

  return (
    <div className="recipe">
      <h2>{title}</h2>
      <p>Ingredients: {ingredients}</p>
      <p>Instructions: {instructions}</p>
      <button onClick={handleRemake} className="gradient-button">Remake</button>
      <button onClick={handleDelete}>X</button>
      <button onClick={handleEdit}>edit</button>
      <button onClick={handleSave}>save</button>
    </div>
  );
};

export default Recipe;