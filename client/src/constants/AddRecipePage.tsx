import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthUserProvider.tsx';
import { useNavigate } from 'react-router-dom';
import '../styles/AddRecipePage.css'

const AddRecipePage: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) {
            alert("Please sign in");
            return;
        }

        if (title && ingredients && instructions) {
            try {
                await axios.post('http://localhost:8080/addRecipe', {
                    title,
                    ingredients,
                    instructions,
                    userId: user.uid
                });
                alert('Recipe added successfully!');
                // Clear form after successful submission
                setTitle('');
                setIngredients('');
                setInstructions('');
                navigate("/")
            } catch (error) {
                console.error('Error adding recipe:', error);
                alert('Failed to add recipe. Please try again.');
            }
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title:</label><br />
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                /><br />

                <label htmlFor="ingredients">Ingredients:</label><br />
                <textarea 
                    id="ingredients" 
                    name="ingredients" 
                    value={ingredients} 
                    onChange={(e) => setIngredients(e.target.value)} 
                    required 
                /><br />

                <label htmlFor="instructions">Instructions:</label><br />
                <textarea 
                    id="instructions" 
                    name="instructions" 
                    value={instructions} 
                    onChange={(e) => setInstructions(e.target.value)} 
                    required 
                /><br />

                <input type="submit" value="Add Recipe" />
            </form>
        </div>
    );
}

export default AddRecipePage;

