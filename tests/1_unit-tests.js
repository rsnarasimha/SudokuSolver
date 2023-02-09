const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    suite('Validate tests', () => {
    // #1
    test('Valid puzzle of 81 chars', () => {
      let [valid, err] = solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
      assert.isTrue(valid, 'Puzzle string is valid');
    });
    // #2
    test('Puzzle with invalid chars', () => {
      let [valid, err] = solver.validate("1.5..2.84.-63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
      assert.isFalse(valid, 'Puzzle with invalid chars');
      assert.deepEqual(err, { error: 'Invalid characters in puzzle' }, 'Invalid characters error')
    });
    // #3
    test('Puzzle with invalid chars', () => {
      let [valid, err] = solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37");
      assert.isFalse(valid, 'Puzzle with invalid length');
      assert.deepEqual(err, { error: 'Expected puzzle to be 81 characters long' }, 'Invalid length error')
    });
  });
  suite('Check placement tests', () => {
    // #1
    test('Valid row placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isTrue(solver.checkRowPlacement(puzzleStr, 0, 2, '8'), 'Row placement is valid');
    });
    // #2
    test('Invalid row placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isFalse(solver.checkRowPlacement(puzzleStr, 0, 1, '1'), 'Row placement is invalid');
    });
    // #3
    test('Valid column placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isTrue(solver.checkColPlacement(puzzleStr, 0, 2, '8'), 'Column placement is valid');
    });
    // #4
    test('Invalid column placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isFalse(solver.checkColPlacement(puzzleStr, 0, 1, '8'), 'Column placement is invalid');
    });
    // #5
    test('Valid region placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isTrue(solver.checkRegionPlacement(puzzleStr, 0, 2, '8'), 'Region placement is valid');
    });
    // #6
    test('Invalid region placement', () => {
      let puzzleStr = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
      assert.isFalse(solver.checkRegionPlacement(puzzleStr, 0, 1, '3'), 'Region placement is invalid');
    });
  });
  suite('Solve tests', () => {
    // #1
    test('Valid puzzle solve', () => {
      let puzzleStr = '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
      let solution = '218396745753284196496157832531672984649831257827549613962415378185763429374928561';
      assert.deepEqual(solver.solve(puzzleStr), solution, 'Puzzle Solved');
    });
    // #2
    test('Invalid puzzle test', () => {
      let puzzleStr = '9.839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1';
      assert.isFalse(solver.solve(puzzleStr), 'Puzzle cannot be solved');
    });
    // #3
    test('Expected solution test', () => {
      let puzzleStr = '..9..571.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      assert.isFalse(solver.solve(puzzleStr), 'Puzzle cannot be solved');
    });
  });
});
