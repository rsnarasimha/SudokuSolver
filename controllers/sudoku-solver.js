class SudokuSolver {

  validate(puzzleString) {
    let invChar = /[^1-9.]+/;
    if (puzzleString.length != 81) {
      return [false, { error: 'Expected puzzle to be 81 characters long' }];
    }
    if (invChar.test(puzzleString)) {
      return [false, { error: 'Invalid characters in puzzle' }];
    }
    return [true, {}];
  }

  check(puzzleString, row, column, value) {

    const result = { valid: true };
    //console.log(row, column, value, typeof (row), typeof (column), typeof (value));
    //check if value already present in row
    if (!this.checkRowPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict = ["row"];
    }

    //check if value already present in column
    if (!this.checkColPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict = result.conflict || [];
      result.conflict.push("column");
    }

    //check if value present in region
    if (!this.checkRegionPlacement(puzzleString, row, column, value)) {
      result.valid = false;
      result.conflict = result.conflict || [];
      result.conflict.push("region");
    }

    return result;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let coordinateIdx = row * 9 + column;

    for (let c = 0; c < 9; c++) {
      let currIdx = row * 9 + c;
      if (currIdx != coordinateIdx && puzzleString[currIdx] === value) return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let coordinateIdx = row * 9 + column;

    for (let r = 0; r < 9; r++) {
      let currIdx = r * 9 + column;
      if (currIdx != coordinateIdx && puzzleString[currIdx] === value) return false;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let coordinateIdx = row * 9 + column;
    let regRow = Math.floor(row / 3) * 3;
    let regCol = Math.floor(column / 3) * 3;

    for (let r = regRow; r < regRow + 3; r++) {
      for (let c = regCol; c < regCol + 3; c++) {
        let currIdx = r * 9 + c;
        if (currIdx != coordinateIdx && puzzleString[currIdx] === value) return false;
      }
    }

    return true;
  }

  isUnique(puzzleString, row, column, value) {
    let coordinateIdx = row * 9 + column;
    let regRow = Math.floor(row / 3) * 3;
    let regCol = Math.floor(column / 3) * 3;

    for (let r = regRow; r < regRow + 3; r++) {
      for (let c = regCol; c < regCol + 3; c++) {
        let currIdx = r * 9 + c;
        //console.log(coordinateIdx, currIdx, puzzleString[currIdx]);
        if (currIdx != coordinateIdx && puzzleString[currIdx] === '.') {
          if (this.check(puzzleString, r, c, value.toString()).valid) {
          //let result = this.check(puzzleString, r, c, value.toString());
          //console.log(value, result);
          //if (result.valid) {
            //console.log(value + 'not unique');
            return false;
          }
        }
      }
    }

    return true;
  }

  solve(puzzleString) {

    //check if puzzle is valid or not
    for (let i = 0; i < 81; i++) {
      let row = Math.floor(i / 9);
      let col = i % 9;

      if (puzzleString[i] != '.') {
        let result = this.check(puzzleString, row, col, puzzleString[i]);
        if (!result.valid) {
          console.log(row, col, puzzleString[i], result);
          return false; //not a valid puzzle
        }
      }
    }

    let puzzleArr = puzzleString.split("");
    let moves = this.playMove(puzzleString);
    while (moves.length > 0) {
      let numMoves = 0;
      for (let i = 0; i < moves.length; i++) {
        //apply the value to the string if only one move
        if (moves[i].numValues == 1) {
          let idx = moves[i].row * 9 + moves[i].col;
          //console.log(idx, puzzleArr[idx], moves[i].values[0])
          puzzleArr[idx] = moves[i].values[0].toString();
          numMoves++;
        }
      }
      let solvedStr = puzzleArr.join("");
      //console.log(solvedStr, numMoves);
      if (numMoves > 0) {
        if (moves.length - numMoves <= 0) {
          if (solvedStr.includes('.')) {
            //no more possible moves
            return false;
          } else {
            return solvedStr;
          }
        } else {
          moves = this.playMove(solvedStr);
        }
      } else {
        /*
        for (let i = 0; i< moves.length; i++) {
          for (let value of moves[i].values) {
            let result = this.solve(solvedStr);
            console.log(result);
            if (result)
              return result;
          }
        }*/
        return false;
        //return false;
      }
    }
  }

  playMove(puzzleString) {
    let choices = [];
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] === '.') {
        //get possible moves for the cell
        let values = [];
        let row = Math.floor(i / 9);
        let col = i % 9;
        for (let value = 1; value <= 9; value++) {
          if (this.check(puzzleString, row, col, value.toString()).valid) {
              values.push(value);
          }
        }
        choices.push({
          'row': row,
          'col': col,
          'values': values,
          'numValues': values.length
        })
      }
    }
    //console.log(choices.length);
    for (let i = 0; i< choices.length; i++) {
      if (choices[i].numValues > 1) {
        //check if unique value possible for the index
        let row = choices[i].row;
        let col = choices[i].col;
        let values = choices[i].values;

        for (let value of values) {
          //console.log(row, col, value);
          if (this.isUnique(puzzleString, row, col, value)) {
            //console.log(value + ' is unique');
            let unique = value;
            choices[i].values = [];
            choices[i].values.push(unique);
            choices[i].numValues = 1;
            //console.log(choices[i]);
            break;
          }
        }
      }
    }

    //console.log(choices, choices.length);
    return choices;
  }
}

module.exports = SudokuSolver;
