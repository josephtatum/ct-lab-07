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

  it('gets an attempt by id', async() => {
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

  it('gets all attempts', async() => {
    const attempts = await Attempt.create([
      { dateOfEvent: '06/28/1991', recipeId: '121' },
      { dateOfEvent: '06/28/1991', recipeId: '122' },
      { dateOfEvent: '06/28/1991', recipeId: '123' }
    ]);

    return request(app)
      .get('/api/v1/attempts')
      .then(res => {
        attempts.forEach(attempt => {
          expect(res.body).toContainEqual({
            _id: attempt._id.toString(),
            name: attempt.name
          });
        });
      });
  });

  it('updates a recipe by id', async() => {
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: '06/28/1991',
      notes: ['I am a note'],
      rating: 2
    });

    return request(app)
      .patch(`/api/v1/attempts/${attempt._id}`)
      .send({ recipeId: '1234' })
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: '1234',
          dateOfEvent: '1991-06-28T07:00:00.000Z',
          notes: ['I am a note'],
          rating: 2,
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: '06/28/1991',
      notes: ['I am a note'],
      rating: 2
    });

    return request(app)
      .delete(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: '123',
          dateOfEvent: '1991-06-28T07:00:00.000Z',
          notes: ['I am a note'],
          rating: 2,
          __v: 0
        });
      });
  });
});
