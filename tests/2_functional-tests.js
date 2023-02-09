const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve tests', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStr })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { solution })
          done();
        });
    });
    test('Solve a puzzle with missing puzzle string', (done) => {
      let puzzleStr = '';
      let expected = { error: 'Required field missing' };

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStr })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Solve a puzzle with invalid characters', (done) => {
      let puzzleStr = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = { error: 'Invalid characters in puzzle' };

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStr })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Solve a puzzle with incorrect length', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
      let expected = { error: 'Expected puzzle to be 81 characters long' };

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStr })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Solve a puzzle that cannot be solved', (done) => {
      let puzzleStr = '..9..571.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = { error: 'Puzzle cannot be solved' };

      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: puzzleStr })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
  });
  suite('POST /api/check tests', () => {
    test('Check a puzzle placement with all fields', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = { valid: true };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'A1',
          value: '7'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with single placement conflict', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        valid: false,
        conflict: ["row"]
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'A5',
          value: '9'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        valid: false,
        conflict: ["row", "region"]
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D2',
          value: '1'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with all placement conflicts', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        valid: false,
        conflict: ["row", "column", "region"]
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D2',
          value: '9'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with missing required fields', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        error: 'Required field(s) missing'
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: '',
          value: '9'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with invalid characters', (done) => {
      let puzzleStr = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        error: 'Invalid characters in puzzle'
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D5',
          value: '2'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with incorrect length', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.';
      let expected = {
        error: 'Expected puzzle to be 81 characters long'
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D5',
          value: '2'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        error: 'Invalid coordinate'
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D10',
          value: '2'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value', (done) => {
      let puzzleStr = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      let expected = {
        error: 'Invalid value'
      };

      chai.request(server)
        .post('/api/check')
        .send({
          puzzle: puzzleStr,
          coordinate: 'D5',
          value: '10'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, expected)
          done();
        });
    });
  });
});
