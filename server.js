const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Pokémon Schema and Model
const PokemonSchema = new mongoose.Schema({
  name: String,
  type: String,
  level: { type: Number, default: 1 },
});

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Pokémon CRUD API! Use /pokemon to interact with the API.');
});

// Create a Pokémon
app.post('/pokemon', async (req, res) => {
  const newPokemon = new Pokemon(req.body);
  await newPokemon.save();
  res.json(newPokemon);
});

// Get all Pokémon
app.get('/pokemon', async (req, res) => {
  const pokemons = await Pokemon.find();
  res.json(pokemons);
});

// Get a specific Pokémon by ID
app.get('/pokemon/:id', async (req, res) => {
  const pokemon = await Pokemon.findById(req.params.id);
  res.json(pokemon);
});

// Update a Pokémon
app.put('/pokemon/:id', async (req, res) => {
  const updatedPokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedPokemon);
});

// Delete a Pokémon
app.delete('/pokemon/:id', async (req, res) => {
  await Pokemon.findByIdAndDelete(req.params.id);
  res.end();
});

// Start server
app.listen(3000, () => {
  console.log('The express app is ready!');
});
