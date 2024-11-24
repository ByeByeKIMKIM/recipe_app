import React from 'react';
import Recipe from './Recipe';
import '../styles/RecipeList.css';

interface RecipeData {
  id: string;
  title: string;
  ingredients: string;
  instructions: string;
  userId: string;
}

interface RecipeListProps {
  recipes: RecipeData[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  return (
    <div className="recipe-list">
      <h1>Recipes</h1>
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <Recipe id={recipe.id} title={recipe.title} 
          ingredients={recipe.ingredients} 
          instructions={recipe.instructions}
          userId={recipe.userId}/>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
