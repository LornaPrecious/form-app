const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  description: String,
  totaltime: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/api/recipe', async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    const savedData = await recipe.save();
    console.log('Data saved successfully:', savedData);
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data');
  }
});


// new route to fetch recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find(); // Retrieve all recipes from the database
    res.status(200).json(recipes); // Send the recipes as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching recipes');
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//db.getCollection('recipes').find({});
//await Recipe.find()