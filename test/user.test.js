var expect = require('chai').expect;
var mongoose = require('mongoose')
var User = require('../models/user')

before(function(done) {
  // ensure our database is empty - waiting till next tick ensures the connection is ready
  setTimeout(function(){ mongoose.connection.db.dropDatabase(done) }, 0)
});

describe('Creating a User', function() {
  it('should create successfully', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Brian',
      password: 'password'
    }, function(err, user) {
      done(err);
    })
  });

  it('should give an error on invalid email addresses', function(done) {
    User.create({
      email: 'test',
      name: 'Brian',
      password: 'password'
    }, function(err, user) {
      // there should be an error
      done(!err);
    })
  });

  it('should give an error on invalid name', function(done) {
    User.create({
      email: 'test@test.co',
      name: '',
      password: 'password'
    }, function(err, user) {
      // there should be an error
      done(!err);
    })
  });

  it('should give an error on invalid password', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Brian',
      password: 'short'
    }, function(err, user) {
      // there should be an error
      done(!err);
    })
  });

  it('should hash the password before save', function(done) {
    User.create({
      email: 'test@test.co',
      name: 'Brian',
      password: 'password'
    }, function(err, newUser) {
      if (newUser.password === 'password') {
        done(newUser);
      } else {
        done(err);
      }
    })
  });
});

describe('User instance methods', function() {
  describe('validPassword', function() {
    it('should validate a correct password', function(done) {
      User.findOne().then(function(err, user) {
        if (user.validPassword('password')) {
          done(err);
        } else {
          done(user);
        }
      })
    });

    it('should invalidate an incorrect password', function(done) {
      User.findOne().then(function(user) {
        if (!user.validPassword('nope')) {
          done(err);
        } else {
          done(user);
        }
      })
    });
  });

  describe('toJSON', function() {
    it('should return a user without a password field', function(done) {
      User.findOne().then(function(user) {
        if (user.toJSON().password === undefined) {
          done();
        } else {
          done(user);
        }
      })
    });
  });
});
