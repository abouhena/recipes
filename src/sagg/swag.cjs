const express = require('express');
const router = express.Router();
const { RecipesModel } = require('../models/Recipes.js');
const { UserModel } = require('../models/Users.js');
const mongoose = require('mongoose');
const { verifyToken } = require('./user.js');

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Retrieve all recipes
 *     description: Retrieve a list of all recipes.
 *     responses:
 *       200:
 *         description: A list of recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Create a new recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewRecipe'
 *     responses:
 *       201:
 *         description: Successfully created recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.post("/", verifyToken, async (req, res) => {
  const recipe= new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    image: req.body.image,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    nutrition: req.body.nutrition,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /recipes/{recipeId}:
 *   get:
 *     summary: Retrieve a recipe by ID
 *     description: Retrieve a recipe by its ID.
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the recipe to retrieve.
 *     responses:
 *       200:
 *         description: The retrieved recipe.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /recipes:
 *   put:
 *     summary: Save a recipe
 *     description: Save a recipe for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipeId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully saved recipe.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savedRecipes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Recipe'
 */
router.put("/", async (req, res) => {
  const { recipeId, userId } = req.body;
  try {
    const recipe = await RecipesModel.findById(recipeId);
    const user = await UserModel.findById(userId);
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /recipes/savedRecipes/ids/{userId}:
 *   get:
 *     summary: Get IDs of saved recipes for a user
 *     description: Get IDs of saved recipes for a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: The IDs of saved recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 savedRecipes:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(200).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /recipes/savedRecipes/{userId}:
 *   get:
 *     summary: Get saved recipes for a user
 *     description: Get saved recipes for a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user.
 *     responses:
 *       200:
 *         description: The saved recipes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.status(200).json({ savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
