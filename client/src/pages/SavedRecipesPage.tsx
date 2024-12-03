import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {useAuth} from '../auth/AuthUserProvider.tsx';
import RecipeList from '../components/RecipeList.tsx';
import { useNavigate } from 'react-router-dom';


const SavedRecipesPage = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const {user} = useAuth();
    const navigate = useNavigate()

    const fetchRecipes = async () => {
        try {
            const uid = user?.uid
            const response = await axios.get('http://localhost:8080/getSavedRecipeIds', {params: { uid: uid }});
            setSavedRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const homeNav = async() => {
        navigate("/")
    }


    return (
        <div>
            <button onClick={homeNav}>Home</button>
            <RecipeList recipes={savedRecipes} />
        </div>
    )
}

export default SavedRecipesPage;