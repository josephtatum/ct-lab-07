const mongoose = require('mongoose');
const Attempt = require('./Attempt.js');

describe('Attempt model', () => {

  it('has a required date', () => {
    const attempt = new Attempt();
    const { errors } = attempt.validateSync();

    expect(errors.dateOfEvent.message).toEqual('Path `dateOfEvent` is required.');
  });

  it('has a required recipeId', () => {
    const attempt = new Attempt();
    const { errors } = attempt.validateSync();

    expect(errors.recipeId.message).toEqual('Path `recipeId` is required.');
  });

});
