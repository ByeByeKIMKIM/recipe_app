import { useState, useEffect } from 'react';
import RecipeList from '../components/RecipeList.tsx';
import axios from 'axios';
import {signInWithGoogle, signOutFirebase} from '../utils/firebase'
import { useAuth } from '../auth/AuthUserProvider.tsx';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'

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

  const addReroute = async() => {
    if(!user) {
      alert("Please sign in")
      return
    }
    navigate('/add-recipe-page');  
  }

  const savedReroute = async() => {
    if(!user) {
      alert("Please sign in")
      return
    }
    navigate('/saved-recipes')
  }

  return (
    <div className="App">
      <button onClick={signInWithGoogle}>Sign In</button>
      <button onClick={signOutFirebase}>Sign Out</button>
      <h1>{user ? `Welcome, ${user.displayName}` : "Sign in"}</h1>
      <button onClick={addReroute}>Add</button>
      <button onClick={savedReroute}>saved</button>
      <RecipeList recipes={recipes} />
    </div>
  );
}

export default HomePage;