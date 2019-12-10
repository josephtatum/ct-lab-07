require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Attempt = require('../lib/models/Attempt');

describe('attempt app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an attempt', () => {
    return request(app)
      .post('/api/v1/attempts')
      .send({
        recipeId: '123',
        dateOfEvent: '06/28/1991',
        notes: ['I am a note'],
        rating: 2
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          dateOfEvent: '1991-06-28T07:00:00.000Z',
          notes: ['I am a note'],
          rating: 2,
          recipeId: '123',
        });
      });
  });

  it('gets a recipe by id', async() => {
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: '06/28/1991',
      notes: ['I am a note'],
      rating: 2
    });

    return request(app)
      .get(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: attempt._id.toString(),
          recipeId: '123',
          dateOfEvent: '1991-06-28T07:00:00.000Z',
          notes: ['I am a note'],
          rating: 2
        });
      });
  });

  it.skip('gets all recipes', async() => {
    const recipes = await Recipe.create([
      { name: 'cookies', directions: [], ingredients: [] },
      { name: 'cake', directions: [], ingredients: [] },
      { name: 'pie', directions: [], ingredients: [] }
    ]);

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual({
            _id: recipe._id.toString(),
            name: recipe.name
          });
        });
      });
  });

  it.skip('updates a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        amount: '4',
        name: 'Cardamom',
        measurement: 'cup'
      }]
    });

    return request(app)
      .patch(`/api/v1/recipes/${recipe._id}`)
      .send({ name: 'good cookies' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: res.body.ingredients[0]._id,
            amount: '4',
            name: 'Cardamom',
            measurement: 'cup'
          }],
          __v: 0
        });
      });
  });

  it.skip('deletes a recipe by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
      ingredients: [{
        amount: '4',
        name: 'Cardamom',
        measurement: 'cup'
      }]
    });

    return request(app)
      .delete(`/api/v1/recipes/${recipe._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ],
          ingredients: [{
            _id: res.body.ingredients[0]._id,
            amount: '4',
            name: 'Cardamom',
            measurement: 'cup'
          }],
          __v: 0
        });
      });
  });
});
