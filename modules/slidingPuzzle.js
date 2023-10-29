//Module for working with sliding puzzles as a matrix, as well as working with solution strings

/*DEPENDENCIES
None
*/

//"Public" function to get MD value based on puzzleMatrix
function calculateManhattanDistance(scrambledMatrix) {
    const height = scrambledMatrix.length;
    const width = scrambledMatrix[0].length;
    let totalDistance = 0;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const currentValue = scrambledMatrix[i][j];
            if (currentValue !== 0) {
                const targetRow = Math.floor((currentValue - 1) / width);
                const targetCol = (currentValue - 1) % width;

                const distance = Math.abs(targetRow - i) + Math.abs(targetCol - j);
                totalDistance += distance;
            }
        }
    }
    return totalDistance;
}

//"Public" function to expand solution string (R3D3 -> RRRDDD)
function expandSolution(solution) {
    return solution.replace(/([A-Z])(\d+)/g, function (_, l, c) {
        return l.repeat(+c);
    });
}

//"Public" function to compress solution string (RRRDDD -> R3D3)
function compressSolution(input) {
    return input.replace(/(.)\1+/g, function (m, c) {
        return c + m.length;
    });
}

//"Public" function to get amount of repeated moves in expanded solution string (RL/DU separately)
function getRepeatedLengths(inputString) {
    let repeatedWidth = 0;
    let repeatedHeight = 0;
    for (let i = 1; i < inputString.length; i++) {
        if (inputString[i] === inputString[i - 1]) {
            if ('DU'.includes(inputString[i])) repeatedHeight++;
            if ('RL'.includes(inputString[i])) repeatedWidth++;
        }
    }
    return { repeatedWidth, repeatedHeight };
}

//"Public" function to make a move (RULD) on a puzzleMatrix
function moveMatrix(matrix, movetype, zeroPos, width, height) {
    const updatedMatrix = matrix;
    const zeroRow = zeroPos[0];
    const zeroCol = zeroPos[1];
    switch (movetype) {
        case 'R':
            if (zeroCol > 0) {
                [updatedMatrix[zeroRow][zeroCol], updatedMatrix[zeroRow][zeroCol - 1]] = [updatedMatrix[zeroRow][zeroCol - 1], updatedMatrix[zeroRow][zeroCol]];
            } else {
                throw new Error("Invalid move: " + movetype + "\nPuzzle state: " + puzzleToScramble(matrix));
            }
            break;
        case 'L':
            if (zeroCol < width - 1) {
                [updatedMatrix[zeroRow][zeroCol], updatedMatrix[zeroRow][zeroCol + 1]] = [updatedMatrix[zeroRow][zeroCol + 1], updatedMatrix[zeroRow][zeroCol]];
            } else {
                throw new Error("Invalid move: " + movetype + "\nPuzzle state: " + puzzleToScramble(matrix));
            }
            break;
        case 'U':
            if (zeroRow < height - 1) {
                [updatedMatrix[zeroRow][zeroCol], updatedMatrix[zeroRow + 1][zeroCol]] = [updatedMatrix[zeroRow + 1][zeroCol], updatedMatrix[zeroRow][zeroCol]];
            } else {
                throw new Error("Invalid move: " + movetype + "\nPuzzle state: " + puzzleToScramble(matrix));
            }
            break;
        case 'D':
            if (zeroRow > 0) {
                [updatedMatrix[zeroRow][zeroCol], updatedMatrix[zeroRow - 1][zeroCol]] = [updatedMatrix[zeroRow - 1][zeroCol], updatedMatrix[zeroRow][zeroCol]];
            } else {
                throw new Error("Invalid move: " + movetype + "\nPuzzle state: " + puzzleToScramble(matrix));
            }
            break;
        default:
            throw new Error("Unexpected move character: " + movetype + "\nPuzzle state: " + puzzleToScramble(matrix));
    }
    return updatedMatrix;
}

//"Public" function to (forcefully) apply Expanded solution on puzzleMatrix (!use moveMatrix for safe approach!)
function applyMoves(matrix, moves) {
    const h = matrix.length, w = matrix[0].length;
    let y = -1, x = -1;
    for (let i = 0; i < h; i++)
        for (let j = 0; j < w; j++)
            if (matrix[i][j] === 0) [y, x] = [i, j];
    for (const move of moves) {
        const [dy, dx] = {
            U: [1, 0],
            D: [-1, 0],
            L: [0, 1],
            R: [0, -1]
        }[move];
        const [ny, nx] = [y + dy, x + dx];
        if (ny < 0 || ny >= h || nx < 0 || nx >= w) {
            return -1;
        }
        [matrix[y][x], matrix[ny][nx]] = [matrix[ny][nx], matrix[y][x]];
        [y, x] = [ny, nx];
    }
    return matrix;
}

//"Public" function to find position of empty tile on a puzzleMatrix
function findZero(matrix, width, height) {
    let zeroRow, zeroCol;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (matrix[i][j] === 0) {
                zeroRow = i;
                zeroCol = j;
                break;
            }
        }
    }
    return [zeroRow, zeroCol];
}

//"Public" function to reverse Expanded solution string (RRRDDD -> UUULLL)
function reverseSolution(solution) {
    return solution.split('').reverse().map(function (l) {
        return ({ U: 'D', D: 'U', L: 'R', R: 'L' }[l] || l);
    }).join('');
}

//"Public" function to guess size of the puzzle based on solution string (largest NxM)
function guessSize(solution) {
    solution = reverseSolution(expandSolution(solution))
    let x = 1,
        y = 1,
        width = 0,
        height = 0;
    for (const move of solution) {
        if (move === 'D') y++;
        if (move === 'R') x++;
        if (move === 'U') y--;
        if (move === 'L') x--;
        width = Math.max(width, x);
        height = Math.max(height, y);
    }
    return [Math.max(2, width), Math.max(2, height)];
}

//"Public" function to guess size of the puzzle based on solution string (largest Square)
function guessSizeSquare(solution) {
    const arr = guessSize(solution);
    return Math.max(arr[0], arr[1]);
}

//"Public" function to check if input string is slidysim-style scramble (no parity checking)
function validateScramble(input) {
    if (!/^[0-9\s/]*$/.test(input)) {
        return false;
    }
    const parts = input.split('/');
    const numCounts = parts.map(part => part.split(' ').length);
    const allEqual = numCounts.every(count => count === numCounts[0]);
    const allNumbers = input.split(/\s|\/| /).map(Number);
    const sortedNumbers = [...allNumbers].sort((a, b) => a - b);
    const isSequential = sortedNumbers.every((num, index) => num === index);
    return allEqual && isSequential;
}

//"Public" function to create puzzleMatrix based on slidysim-style scramble
function scrambleToPuzzle(inputString) {
    return inputString.split('/').map(row => row.split(' ').map(Number));
}

//"Public" function to create solved puzzleMatrix of given size
function createPuzzle(width, height) {
    let counter = 1;
    return Array.from({
        length: height
    }, (_, i) => Array.from({
        length: width
    }, (_, j) => (i === height - 1 && j === width - 1) ? 0 : counter++));
}

//"Public" function to create slidysim-style scramble based on puzzleMatrix
function puzzleToScramble(puzzle) {
    return puzzle.map(row => row.join(' ')).join('/');
}

//"Public" function to parse puzzleMatrix from the valid solution for given size
function parseScramble(width, height, solution) {
    return applyMoves(createPuzzle(width, height), reverseSolution(expandSolution(solution)));
}

//"Public" function to parse puzzleMatrix from the valid solution for biggest NxM size
function parseScrambleGuess(solution) {
    const sizeGuess = guessSize(solution);
    return parseScramble(sizeGuess[0], sizeGuess[1], solution);
}

//"Public" function to parse puzzleMatrix from the valid solution for biggest square size
function parseScrambleGuessSquare(solution) {
    const sizeGuess = guessSizeSquare(solution);
    return parseScramble(sizeGuess, sizeGuess, solution);
}

//"Public" function to expand puzzleMatrix to a bigger puzzle with size WxH (bottom-right)
function expandMatrix(matrix, W, H) {
    const numRows = matrix.length;
    const numCols = matrix[0].length;
    const numRowsDiff = W - numRows;
    const numColsDiff = H - numCols;
    const expandedMatrix = createPuzzle(W, H);
    const mappingMatrix = createPuzzle(W, H);
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const value = matrix[i][j];
            let originalValue = 0;
            if (value !== 0) {
                const rowIndex = Math.floor((value - 1) / numCols);
                const colIndex = (value - 1) % numCols;
                originalValue = mappingMatrix[rowIndex + numRowsDiff][colIndex + numColsDiff];
            }
            expandedMatrix[i + numRowsDiff][j + numColsDiff] = originalValue;
        }
    }
    return expandedMatrix;
}
