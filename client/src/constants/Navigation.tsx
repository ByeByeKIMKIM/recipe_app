
import HomePage from "../pages/Home";
import RecipeDetails from "../pages/RemakePage";
import SavedRecipesPage from "../pages/SavedRecipesPage";
import AddRecipePage from "./AddRecipePage";

export const PATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "/",
        label: "Home",
        element: <HomePage />,
    },
    {
        link:"/recipe-details",
        label:"Details",
        element: <RecipeDetails/>
    },
    {
        link:"/add-recipe-page",
        label:"Add",
        element: <AddRecipePage/>
    },
    {
        link:"/saved-recipes",
        label:"Saved",
        element: <SavedRecipesPage/>
    },
];
