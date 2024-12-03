import path from "path";
import express, { Express } from "express";
import cors from "cors";
import fetch from "node-fetch";
import OpenAI from "openai";
import { db } from './firebase';
import axios from 'axios';
import { GPT_KEY } from "./keys";


import 'firebase/firestore';




const app: Express = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.get('/getRecipes', async (req, res) => {
    try {
      const recipesCollectionRef = db.collection('recipes');
      const snapshot = await recipesCollectionRef.get();
  
      if (snapshot.empty) {
        res.status(404).json({ message: 'No recipes found' });
        return;
      }
  
      const recipes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      res.json(recipes);
  
    } catch (err) {
      console.error("Error fetching documents:", err);
      res.status(500).json({ error: 'Error fetching documents' });
    }
  })

  app.get('/getSavedRecipeIds', async (req, res) => {
    const userUid = req.query.uid;
    const usersCollectionRef = db.collection('users');

    try {
      const querySnapshot = await usersCollectionRef.where("uid", "==", userUid).get();
      
      if (querySnapshot.empty) {
        res.status(404).send("No user found with the given UID");
        return;
      }
  
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      const recipeIds = userData.recipes || [];

      const recipesCollectionRef = db.collection('recipes');
      const recipeSnapshot = await Promise.all(
        recipeIds.map((id: string) => recipesCollectionRef.doc(id).get())
      );
      const recipes = recipeSnapshot
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      res.status(200).json(recipes);
      //const snapShot = await recipesCollectionRef.where()
      //const recipeSnapshot = await recipesCollectionRef.where(firebase.firestore.FieldPath.documentId(), 'in', recipeIds).get();

      // const recipes = recipeSnapshot.docs.map(doc => ({
      //     id: doc.id,
      //     ...doc.data()
      // }));
    } catch (error) {
      console.error("Error fetching user document:", error);
      res.status(500).send("An error occurred while fetching the user document");
    }
  })

  // app.get('/getSavedRecipes', async (req, res) => {
  //   try {
  //     const recipesCollectionRef = db.collection('recipes');
  //     const snapshot = await recipesCollectionRef.get();
  
  //     if (snapshot.empty) {
  //       res.status(404).json({ message: 'No recipes found' });
  //       return;
  //     }
  
  //     const recipes = snapshot.docs.map(doc => ({
  //       id: doc.id,
  //       ...doc.data()
  //     }));
  
  //     res.json(recipes);
  
  //   } catch (err) {
  //     console.error("Error fetching documents:", err);
  //     res.status(500).json({ error: 'Error fetching documents' });
  //   }
  // })
  
  app.post('/addRecipe', async (req, res) => {
    const { title, ingredients, instructions, userId } = req.body;
    try {
      const recipeCollectionRef = db.collection('recipes');
      //CREATE A NEW DOC
      const newDocRef = recipeCollectionRef.doc(); // Auto-generate unique ID
      await newDocRef.set({
        title: title,
        ingredients: ingredients,
        instructions: instructions,
        userId: userId
      });
      res.json({ message: 'Recipe added successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to add recipe' });
    }
  });
  
  app.post('/gpt', async (req, res) => {
    const { content } = req.body;
    const openai = new OpenAI({
      apiKey: GPT_KEY
    });
  
    try {
      const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
              { role: "system", content: "You are a helpful assistant." },
              {
                  role: "user",
                  content: content,
              },
          ],
      });
      res.status(200).json(completion.choices[0].message); 
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading API response.");
    }
  })
  
  app.put('/changeRecipe/:id', async(req, res) => {
    const id = req.params.id

    const {newTitle, newIngredients, newInstructions, userId} = req.body;
    try {
      const recipesCollectionRef = db.collection('recipes');
      const docRef = recipesCollectionRef.doc(id)

      // Update the document
      await docRef.set({
        title: newTitle,
        ingredients: newIngredients,
        instructions: newInstructions,
        userId: userId
      });;
      //use .set() to change one of the documents based on id
  
    } catch (err) {
      console.error("Error changing recipe:", err);
      res.status(500).json({ error: 'Error changing recipe' });
    }
  }) 

  app.delete('/deleteRecipe/:id', async(req, res) => {
    const id = req.params.id
    try {
      const recipesCollectionRef = db.collection('recipes');
      const docRef = recipesCollectionRef.doc(id)
      await docRef.delete();

      res.status(200).json({ message: 'Recipe deleted successfully' });  
    } catch (err) {
      console.error("Error deleting recipe:", err);
      res.status(500).json({ error: 'Error deleting recipe' });
    }
  })


// updating the user's name with the id
app.put("/user/:id", (req, res) => {
    const { newName } = req.body;
    const id = req.params.id;
    res.send(`Hi ${newName} at id: ${id}, this is a PUT endpoint.`);
});

// deletes data for some id up to some limit
app.delete("/user/:id", (req, res) => {
    const limit = req.query.limit ?? 1;
    res.send(
        `This is a DELETE request for at most ${limit} items for id ${req.params.id}`
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
