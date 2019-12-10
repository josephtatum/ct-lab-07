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
    const date = new Date;
    return request(app)
      .post('/api/v1/attempts')
      .send({
        recipeId: '123',
        dateOfEvent: date,
        notes: ['I am a note'],
        rating: 2
      })
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: expect.any(String),
          dateOfEvent: date.toISOString(),
          notes: ['I am a note'],
          rating: 2,
          recipeId: '123',
        });
      });
  });

  it('gets an attempt by id', async() => {
    const date = new Date;
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: date,
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
          dateOfEvent: date.toISOString(),
          notes: ['I am a note'],
          rating: 2
        });
      });
  });

  it('gets all attempts', async() => {
    const date = new Date;
    const attempts = await Attempt.create([
      { dateOfEvent: date, recipeId: '121' },
      { dateOfEvent: date, recipeId: '122' },
      { dateOfEvent: date, recipeId: '123' }
    ]);

    return request(app)
      .get('/api/v1/attempts')
      .then(res => {
        attempts.forEach(attempt => {
          expect(res.body).toContainEqual({
            _id: attempt._id.toString()
          });
        });
      });
  });

  it('updates a recipe by id', async() => {
    const date = new Date;
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: date,
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
          dateOfEvent: date.toISOString(),
          notes: ['I am a note'],
          rating: 2,
          __v: 0
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const date = new Date;
    const attempt = await Attempt.create({
      recipeId: '123',
      dateOfEvent: date,
      notes: ['I am a note'],
      rating: 2
    });

    return request(app)
      .delete(`/api/v1/attempts/${attempt._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: attempt._id.toString(),
          recipeId: '123',
          dateOfEvent: date.toISOString(),
          notes: ['I am a note'],
          rating: 2,
          __v: 0
        });
      });
  });
});
