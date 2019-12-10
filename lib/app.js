const express = require('express');
const app = express();
const Recipe = require('./models/Recipe');

app.use(express.json());
app.use('/api/v1/recipes', require('./routes/recipe.js'));

module.exports = app;
