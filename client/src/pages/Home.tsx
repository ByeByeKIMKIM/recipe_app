import { useState, useEffect } from 'react';
import RecipeList from '../components/RecipeList.tsx';
import axios from 'axios';
import {signInWithGoogle, signOutFirebase} from '../utils/firebase'
import { useAuth } from '../auth/AuthUserProvider.tsx';
import { useNavigate } from 'react-router-dom';

// import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import {login} from '/Users/kimkim/trends-in-webdev/final-project/frontend/src/auth/auth_google_provider'
// import {signInWithGoogle} from '../utils/firebase.ts'

function HomePage() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([]);
  const {user} = useAuth();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getRecipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const addRecipe = async () => {
    if(!user) {
      alert("Please sign in")
      return;
    }

    const recipeName = prompt('Enter the name of the recipe');
    const ingredients = prompt('Enter the ingredients for the recipe');
    const instructions = prompt('Enter the instructions for the recipe');
    const userId = user.uid;

    if (recipeName && ingredients && instructions) {
      try {
        await axios.post('http://localhost:8080/addRecipe', {
          title: recipeName,
          ingredients: ingredients,
          instructions: instructions,
          userId: userId
        });
        fetchRecipes(); // Re-fetch recipes after adding a new one
      } catch (error) {
        console.error('Error adding recipe:', error);
      }
    }
  };

  const addReroute = async() => {
    navigate('/add-recipe-page');  
  }

  

  return (
    <div className="App">
      <button onClick={signInWithGoogle}>Sign In</button>
      <button onClick={signOutFirebase}>Sign Out</button>
      <button onClick={addReroute}>Add</button>
      <h1>{user ? `Welcome, ${user.displayName}` : "Sign in"}</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default HomePage;