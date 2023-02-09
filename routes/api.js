'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

const rowCharToNum = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8
}

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //console.log('in api/check');
      //console.log(req.body);
      let puzzle = req.body.puzzle;
      let coordinate = req.body.coordinate;
      let value = req.body.value;

      //check if all required fields are provided
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      //check if valid puzzle
      let [valid, error] = solver.validate(puzzle);
      if (!valid) {
        return res.json(error);
      }

      //if valid puzzle, check if coordinates are valid
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      //check for valid value (1-9)
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      //check if value provided is already placed / can
      //be placed in provided coordinate
      let row = rowCharToNum[coordinate.charAt(0)];
      let col = coordinate.charAt(1) - 1;
      let canPlace = solver.check(puzzle, row, col, value);
      return res.json(canPlace);

    });

  app.route('/api/solve')
    .post((req, res) => {
      //console.log('in api/solve');
      //console.log(req.body.puzzle);
      let puzzle = req.body.puzzle;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      };

      //validate the puzzle string provided
      let [valid, error] = solver.validate(puzzle);
      if (!valid) {
        return res.json(error);
      }

      //solve the puzzle
      let solution = solver.solve(puzzle);
      if (!solution) {
        console.log("cannot solve");
        return res.json({ error: 'Puzzle cannot be solved' });
      } else {
        console.log('puzzle solved', solution);
        return res.json({ solution });
      }
    });
};
