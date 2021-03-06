const router = require('express').Router()
const {Recipe, Ingredient} = require('../db/models')
const cheerio = require('cheerio')
const axios = require('axios')
const {
  findImg,
  findPrepTime,
  findCookTime,
  findTotalTime,
  findIngredients,
  findInstructions,
  findServings,
  findTitle
} = require('../../script/scrapers')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll()
    res.json(recipes)
  } catch (err) {
    next(err)
  }
})

router.get('/:recipeId', async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    const recipe = await Recipe.findOne({
      where: {
        id: recipeId
      }
    })
    res.json(recipe)
  } catch (err) {
    next(err)
  }
})

router.get('/:recipeId/:stepNum', async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    const stepNum = req.params.stepNum
    const recipe = await Recipe.findOne({
      where: {
        id: recipeId
      },
      include: [
        {
          model: Ingredient
        }
      ]
    })

    res.json(recipe.steps[stepNum - 1])
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const recipe = {
      imgUrl: req.body.imgUrl,
      name: req.body.name,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      totalTime: req.body.totalTime,
      serving: req.body.serving,
      steps: req.body.steps.split('\n'),
      ingredients: req.body.ingredients.split('\n')
    }
    const newRecipe = await Recipe.create(recipe)
    res.json(newRecipe)
  } catch (err) {
    next(err)
  }
})

router.post('/scrape', async (req, res, next) => {
  const {url} = req.body
  try {
    const {data: html, status} = await axios.get(url)
    if (status === 200) {
      const $ = cheerio.load(html)
      const prepTime = findPrepTime($)
      const cookTime = findCookTime($)
      const recipe = {
        name: findTitle($),
        imgUrl: findImg($),
        prepTime: prepTime,
        cookTime: cookTime,
        totalTime: findTotalTime($) || prepTime + cookTime,
        serving: findServings($),
        ingredients: findIngredients($),
        steps: findInstructions($)
      }
      if (recipe.ingredients.length && recipe.steps.length) {
        const [savedRecipe] = await Recipe.findOrCreate({
          where: {name: recipe.name},
          defaults: recipe
        })
        res.status(200).send(savedRecipe)
      } else {
        res.status(204).send('Error in URL provided for scraping')
      }
    } else {
      res.status(204).send('Error in URL provided for scraping')
    }
  } catch (err) {
    res.status(204).send('Error in URL provided for scraping')
  }
})

router.put('/:recipeId', async (req, res, next) => {
  try {
    const oldRecipe = await Recipe.findOne({
      where: {id: req.params.recipeId}
    })

    const recipe = {
      imgUrl: req.body.imgUrl,
      name: req.body.name,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      totalTime: req.body.totalTime,
      serving: req.body.serving,
      steps: req.body.steps,
      ingredients: req.body.ingredients
    }
    const updated = await oldRecipe.update(recipe)

    res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/:recipeId', async (req, res, next) => {
  try {
    const recipeId = req.params.recipeId
    await Recipe.destroy({
      where: {
        id: recipeId
      }
    })
  } catch (err) {
    next(err)
  }
})
