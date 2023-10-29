//Module for automatically detecting grids color schemes for sliding puzzles bigger than 5x5

/*DEPENDENCIES
slidingPuzzle.js
*/

//"Public" (mostly experimental) Function to guess possible cycles in the solution
function getCyclesNumbers(matrix, solution, movesEarly = 0.96, movesLate = 0.98, safeRect = 0.5) {
    width = matrix[0].length;
    height = matrix.length;
    solLen = solution.length;
    earlyCount = movesEarly * solLen;
    lateCount = movesLate * solLen;
    safeWidth = Math.round(width * safeRect);
    safeHeight = Math.round(height * safeRect);
    let unsolvedInfo = [];
    matrixCopy = JSON.parse(JSON.stringify(matrix));
    for (let moveIndex = 0; moveIndex < lateCount; moveIndex++) {
        const move = solution[moveIndex];
        const zeroPos = findZero(matrixCopy, width, height);
        matrixCopy = moveMatrix(matrixCopy, move, zeroPos, width, height);
        if (moveIndex > earlyCount) {
            unsolvedInfo.push(getSolveElementsAmount(matrixCopy, safeWidth, safeHeight));
        }
    }
    try {
        return unsolvedInfo.reduce((min, current) => current.amount < min.amount ? current : min)
            .arrayOfUnsolved;
    } catch (error) {
        return [];
    }
}

//"Public" Function to analyse grids based on matrix, solution, and list of cycles
function analyseGridsInitial(matrix, solution, cycledNumbers) {
    const height = matrix.length;
    const width = matrix[0].length;
    return analyseGrids(matrix, solution, width, height, width, height, 0, 0, 0, cycledNumbers);
}

//"Public" Function to Generates Grids based on guessed data
function generateGridsStats(gridsData) {
    const levels = {};
    (function traverse(node, id) {
        if (node) {
            levels[id] = getDataByLevel(node);
            traverse(node.nextLayerFirst, node.gridsStarted);
            traverse(node.nextLayerSecond, node.gridsStopped);
        }
    })(gridsData, 0);
    return levels;
}

//"Public" Function to directly get state of grids based on current move index 
function getGridsState(gridsStates, moveIndex) {
    const keys = Object.keys(gridsStates).map(Number);
    const highestKey = keys.reduce((acc, key) => (key <= moveIndex ? key : acc), -1);
    return gridsStates[highestKey];
}
//_________________End of "Public" functions of this module_________________//

//_________________"Private" Functions for generateGridsStats_________________//

function getDataByLevel(currentLevel) {
    return {
        secondaryColors: getSecondaryColorsByLevel(currentLevel),
        mainColors: getMainColorsByLevel(currentLevel),
        activeZone: getActiveZoneByLevel(currentLevel)
    };
}

function getActiveZoneByLevel(currentLevel) {
    return getSizesForLayer(0, currentLevel);
}

function getMainColorsByLevel(currentLevel) {
    if (currentLevel.enableGridsStatus === -1) {
        return [getSizesForLayer(cTMap['fringe'], currentLevel)];
    }
    return [
        getSizesForLayer(cTMap['grids1'], currentLevel.nextLayerFirst),
        getSizesForLayer(cTMap['grids2'], currentLevel.nextLayerSecond)
    ];
}

function getSecondaryColorsByLevel(currentLevel) {
    let secondaryColors = [];
    if (currentLevel.enableGridsStatus === -1) {
        return secondaryColors;
    }
    const fL = currentLevel.nextLayerFirst;
    const sL = currentLevel.nextLayerSecond;
    if (fL.nextLayerFirst) {
        secondaryColors.push(getSizesForLayer(cTMap['grids1'], fL.nextLayerFirst));
        secondaryColors.push(getSizesForLayer(cTMap['grids2'], fL.nextLayerSecond));
    } else {

        secondaryColors.push(getSizesForLayer(cTMap['fringe'], fL));
    }
    if (sL.nextLayerSecond) {
        secondaryColors.push(getSizesForLayer(cTMap['grids1'], sL.nextLayerFirst));
        secondaryColors.push(getSizesForLayer(cTMap['grids2'], sL.nextLayerSecond));
    } else {
        secondaryColors.push(getSizesForLayer(cTMap['fringe'], sL));
    }
    return secondaryColors;
}

function getSizesForLayer(typeN, layer) {
    return {
        type: typeN,
        width: layer.width,
        height: layer.height,
        offsetW: layer.offsetW,
        offsetH: layer.offsetH
    };
}

//_________________"Private" Functions for generateGridsStats ends_________________//

//_________________"Private" Functions for analyseGridsInitial_________________//

function analyseGrids(matrix, solution, widthInitial, heightInitial, width, height, offsetW, offsetH, movesOffsetCounter, cycledNumbers) {
    let matrixCopy = JSON.parse(JSON.stringify(matrix));
    for (let moveIndex = 0; moveIndex < solution.length; moveIndex++) {
        const move = solution[moveIndex];
        const zeroPos = findZero(matrixCopy, widthInitial, heightInitial);
        matrixCopy = moveMatrix(matrixCopy, move, zeroPos, widthInitial, heightInitial);
        const gridsStatus = guessGrids(matrixCopy, width, height, offsetW, offsetH, widthInitial);
        if (gridsStatus !== 0) {
            let gridsStarted = moveIndex;
            let enableGridsStatus = gridsStatus;
            let girdsUnsolvedLast = null;
            let matrixBeforeGrids = JSON.parse(JSON.stringify(matrixCopy));
            for (let gridsStoppedTempID = gridsStarted + 1; gridsStoppedTempID < solution.length; gridsStoppedTempID++) {
                const move = solution[gridsStoppedTempID];
                const zeroPos = findZero(matrixCopy, widthInitial, heightInitial);
                matrixCopy = moveMatrix(matrixCopy, move, zeroPos, widthInitial, heightInitial);
                if (!gridsSolved(matrixCopy, width, height, offsetW, offsetH, enableGridsStatus, widthInitial, cycledNumbers)) {
                    girdsUnsolvedLast = gridsStoppedTempID;
                } else {
                    break;
                }
            }
            if (girdsUnsolvedLast === null) {
                return "Error, grids never stopped";
            } else {
                const gridsStopped = girdsUnsolvedLast + 1;
                const sol1 = solution.slice(gridsStarted + 1, gridsStopped + 2);
                const sol2 = solution.slice(gridsStopped + 2);
                const newParts = getGridsParts(matrixBeforeGrids, sol1, widthInitial, heightInitial);
                if (newParts !== null) {
                    if (enableGridsStatus === 1) {
                        //top grids
                        const width_First = width;
                        const width_Second = width;
                        const offsetW_First = offsetW;
                        const offsetW_Second = offsetW;
                        const height_First = Math.ceil(height / 2);
                        const height_Second = height - height_First;
                        const offsetH_First = offsetH;
                        const offsetH_Second = height_First + offsetH;
                        return {
                            enableGridsStatus,
                            gridsStarted: gridsStarted + movesOffsetCounter,
                            gridsStopped: gridsStopped + movesOffsetCounter,
                            width,
                            height,
                            offsetW,
                            offsetH,
                            nextLayerFirst: analyseGrids(newParts[0], sol1, widthInitial, heightInitial, width_First, height_First, offsetW_First, offsetH_First, movesOffsetCounter + gridsStarted + 1, cycledNumbers),
                            nextLayerSecond: analyseGrids(newParts[1], sol2, widthInitial, heightInitial, width_Second, height_Second, offsetW_Second, offsetH_Second, movesOffsetCounter + gridsStopped + 1, cycledNumbers)
                        };
                    }
                    if (enableGridsStatus === 2) {
                        //left grids
                        const width_First = Math.ceil(width / 2);
                        const width_Second = width - width_First;
                        const offsetW_First = offsetW;
                        const offsetW_Second = width_First + offsetW;
                        const height_First = height;
                        const height_Second = height;
                        const offsetH_First = offsetH;
                        const offsetH_Second = offsetH;
                        return {
                            enableGridsStatus,
                            gridsStarted: gridsStarted + movesOffsetCounter,
                            gridsStopped: gridsStopped + movesOffsetCounter,
                            width,
                            height,
                            offsetW,
                            offsetH,
                            nextLayerFirst: analyseGrids(newParts[0], sol1, widthInitial, heightInitial, width_First, height_First, offsetW_First, offsetH_First, movesOffsetCounter + gridsStarted + 1, cycledNumbers),
                            nextLayerSecond: analyseGrids(newParts[1], sol2, widthInitial, heightInitial, width_Second, height_Second, offsetW_Second, offsetH_Second, movesOffsetCounter + gridsStopped + 1, cycledNumbers)
                        };
                    }
                }
                return {
                    enableGridsStatus,
                    gridsStarted,
                    gridsStopped,
                    width,
                    height,
                    offsetW,
                    offsetH,
                    nextLayerFirst: null,
                    nextLayerSecond: null
                };
            }
        }
    }
    return {
        enableGridsStatus: -1,
        width,
        height,
        offsetW,
        offsetH,
    };
}

function getGridsParts(matrixBeforeGrids, solution, width, height) {
    if (width < 6 && height < 6) {
        return null;
    }
    const firstMatrix = JSON.parse(JSON.stringify(matrixBeforeGrids));
    for (let moveIndex = 0; moveIndex < solution.length; moveIndex++) {
        const move = solution[moveIndex];
        const zeroPos = findZero(matrixBeforeGrids, width, height);
        matrixBeforeGrids = moveMatrix(matrixBeforeGrids, move, zeroPos, width, height);
    }

    const secondMatrix = matrixBeforeGrids;
    return [firstMatrix, secondMatrix];
}

function guessGrids(matrix, width, height, offsetW, offsetH, widthInitial) {
    //2 left-right grids
    //1 top-bottom grids (checks first)
    //0 no grids
    if (width < 6 && height < 6) {
        return 0;
    }
    if (height > 5) {
        if (checkTopBottom(matrix, width, height, offsetW, offsetH, widthInitial)) {
            return 1;
        }
    }
    if (width > 5) {
        if (checkLeftRight(matrix, width, height, offsetW, offsetH, widthInitial)) {
            return 2;
        }
    }
    return 0;
}

function checkTopBottom(matrix, width, height, offsetW, offsetH, widthInitial) {
    let newH = Math.ceil(height / 2) + offsetH;
    let solvedCounter = 0;
    for (let row = offsetH; row < newH; row++) {
        for (let col = offsetW; col < width + offsetW; col++) {
            const number = matrix[row][col];
            if (number !== 0 && Math.floor((number - 1) / widthInitial) >= newH) {
                return false;
            }
            if (numberIsSovled(number, row, col, widthInitial)) {
                solvedCounter++;
            }
        }
    }
    return width * (newH - offsetH) / 3 > solvedCounter;
}

function checkLeftRight(matrix, width, height, offsetW, offsetH, widthInitial) {
    let newW = Math.ceil(width / 2) + offsetW;
    let solvedCounter = 0;
    for (let row = offsetH; row < height + offsetH; row++) {
        for (let col = offsetW; col < newW; col++) {
            const number = matrix[row][col];
            if (number !== 0 && (number - 1) % widthInitial >= newW) {
                return false;
            }
            if (numberIsSovled(number, row, col, widthInitial)) {
                solvedCounter++;
            }
        }
    }
    return height * (newW - offsetW) / 3 > solvedCounter;
}

function gridsSolved(matrix, width, height, offsetW, offsetH, gridsType, widthInitial, cycledNumbers) {
    //2 left-right grids
    //1 top-bottom grids 
    if (gridsType === 1) {
        let newH = Math.ceil(height / 2) + offsetH;
        for (let row = offsetH; row < newH; row++) {
            for (let col = offsetW; col < width + offsetW; col++) {
                const number = matrix[row][col];
                if (number !== 0 && !numberIsSovled(number, row, col, widthInitial)) {
                    if (!cycledNumbers.includes(number)) {
                        return false;
                    }
                }
            }
        }
    }
    if (gridsType === 2) {
        let newW = Math.ceil(width / 2) + offsetW;
        for (let row = offsetH; row < height + offsetH; row++) {
            for (let col = offsetW; col < newW; col++) {
                const number = matrix[row][col];
                if (number !== 0 && !numberIsSovled(number, row, col, widthInitial)) {
                    if (!cycledNumbers.includes(number)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function numberIsSovled(number, row, col, width) {
    if (number === 0) {
        return false;
    }
    return (Math.floor((number - 1) / width) === row && (number - 1) % width === col);
}

//_________________"Private" Functions for analyseGridsInitial ends_________________//

//_________________"Private" Functions for getCyclesNumbers_________________//

function getSolveElementsAmount(matrix, safeWidth = 0, safeHeight = 0) {
    const flatMatrix = matrix.flat();
    const N = flatMatrix.length;
    const unsolved = flatMatrix.filter((num, index) => {
        if (num === 0) return false;
        const expectedRow = Math.floor(index / matrix[0].length);
        const expectedCol = index % matrix[0].length;
        return (
            num !== expectedRow * matrix[0].length + expectedCol + 1 &&
            !(expectedRow >= matrix.length - safeHeight && expectedCol >= matrix[0].length - safeWidth)
        );
    });
    return {
        amount: unsolved.length,
        arrayOfUnsolved: unsolved
    };
}

//_________________"Private" Functions for getCyclesNumbers ends_________________//
