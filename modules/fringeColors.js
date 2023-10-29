//Module for generating fringe color schemes for sliding puzzles

/*DEPENDENCIES
slidingPuzzle.js
*/

//"Public" function to generate list of all necessary color scheme matrixes based on Grids Data
function getAllFringeSchemes(gridStates) {
    const fringeSchemes = {};
    for (const key in gridStates) {
        const {
            mainColors
        } = gridStates[key];
        const {
            secondaryColors
        } = gridStates[key];
        if (mainColors.length === 1) {
            const {
                width,
                height
            } = mainColors[0];
            const pair = `${width}x${height}`;
            if (!fringeSchemes[pair]) {
                fringeSchemes[pair] = getFringeColorsNxM(width, height);
            }
        }
        secondaryColors.forEach(function (secondaryColor) {
            const {
                width,
                height,
                type
            } = secondaryColor;
            if (type === cTMap["fringe"]) {
                const pair = `${width}x${height}`;
                if (!fringeSchemes[pair]) {
                    fringeSchemes[pair] = getFringeColorsNxM(width, height);
                }
            }
        });
    }
    return fringeSchemes;
}

//"Public" function to generate fringe color scheme for NxM sliding puzzle
function getFringeColorsNxM(width, height) {
    const scrambleMatrix = createPuzzle(width, height);
    const NxMMatrix = splitMatrix(scrambleMatrix);
    const startingMatrix = NxMMatrix[1];
    const squareMatrix = NxMMatrix[0];
    if (startingMatrix === null) {
        const numColors = squareMatrix.length * 2 - 2;
        const colorsList = getColors(numColors);
        return generateColorFringe(colorsList, squareMatrix.length);
    } else {
        const originalWidth = width;
        const originalHeight = height;
        const startingWidth = startingMatrix[0].length;
        const startingHeight = startingMatrix.length;
        const sqaureSize = squareMatrix.length;
        const extraSize = Math.max(originalWidth, originalHeight) - sqaureSize;
        const numColors = extraSize + sqaureSize * 2 - 2;
        const colorsList = getColors(numColors);
        const startingColors = colorsList.slice(0, extraSize);
        const squareColors = colorsList.slice(extraSize);
        const colorsMatrixSquare = generateColorFringe(squareColors, sqaureSize);
        let extraColorsMatrix;
        let matchByWidth = (originalWidth < originalHeight);
        if (!matchByWidth) {
            extraColorsMatrix = getColumnsColors(startingColors, startingWidth, startingHeight);
        } else {
            extraColorsMatrix = getRowsColors(startingColors, startingWidth, startingHeight);
        }
        return mergeMatricesByMatchingDimension(extraColorsMatrix, colorsMatrixSquare, matchByWidth);
    }
}

//"Public" function to generate mono scheme for NxM sliding puzzle of given color (!no 0 exception!)
function getMonoColors(color, width, height) {
    return Array.from({
        length: height
    }, () => Array(width)
        .fill(color));
}

//_________________End of "Public" functions of this module_________________//

//_________________"Private" functions for getFringeColorsNxM_________________

function generateColorFringe(colorsList, size) {
    const matrix = Array.from({
        length: size
    }, () => Array(size).fill(null));
    for (let i = 0; i < colorsList.length; i++) {
        if (i === 0) {
            for (let j = 0; j < size; j++) {
                matrix[0][j] = colorsList[i];
            }
        } else if (i % 2 === 0) {
            const rowIndex = Math.floor(i / 2);
            for (let j = 0; j < size; j++) {
                if (matrix[rowIndex][j] === null) {
                    matrix[rowIndex][j] = colorsList[i];
                }
            }
        } else {
            const colIndex = Math.floor(i / 2);
            for (let j = 0; j < size; j++) {
                if (matrix[j][colIndex] === null) {
                    matrix[j][colIndex] = colorsList[i];
                }
            }
        }
    }
    matrix[size - 1][size - 1] = pinkNullColor;
    return matrix;
}

function getColors(numColors) {
    if (numColors < 1) {
        return [];
    }
    const colors = [];
    const colorStep = 360 / numColors;
    for (let i = 0; i < numColors; i++) {
        const hue = i * colorStep;
        const rgbColor = hslToRgb(hue / 360, 0.78, 0.6); // Adjust saturation and lightness as needed
        colors.push(rgbColor);
    }
    return colors;
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function getColumnsColors(colorsList, width, height) {
    const matrix = Array.from({
        length: height
    }, () =>
        Array.from({
            length: width
        }, (_, colIndex) => colorsList[colIndex % colorsList.length])
    );
    return matrix;
}

function getRowsColors(colorsList, width, height) {
    const matrix = Array.from({
        length: height
    }, (_, rowIndex) => colorsList[rowIndex % colorsList.length]);
    return matrix.map(row => Array.from({
        length: width
    }, () => row));
}

function splitMatrix(matrix) {
    const height = matrix.length;
    const width = matrix[0].length;
    const squareSize = Math.min(width, height);
    const squareMatrix = Array.from({
        length: squareSize
    }, () => Array(squareSize).fill(0));
    for (let i = 0; i < squareSize; i++) {
        for (let j = 0; j < squareSize; j++) {
            squareMatrix[i][j] = matrix[height - squareSize + i][width - squareSize + j];
        }
    }
    let otherPartMatrix = null;
    if (width !== height) {
        if (width > height) {
            const otherPartWidth = width - squareSize;
            otherPartMatrix = Array.from({
                length: height
            }, () => Array(otherPartWidth).fill(0));
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < otherPartWidth; j++) {
                    otherPartMatrix[i][j] = matrix[i][j];
                }
            }
        } else {
            const otherPartHeight = height - squareSize;
            otherPartMatrix = Array.from({
                length: otherPartHeight
            }, () => Array(width).fill(0));
            for (let i = 0; i < otherPartHeight; i++) {
                for (let j = 0; j < width; j++) {
                    otherPartMatrix[i][j] = matrix[i][j];
                }
            }
        }
    }
    return [squareMatrix, otherPartMatrix];
}

function mergeMatricesByMatchingDimension(matrix1, matrix2, matchByWidth) {
    if (matchByWidth) {
        return matrix1.concat(matrix2);
    } else {
        return matrix1.map((row, index) => row.concat(matrix2[index] || []));
    }
}

//_________________"Private" functions for getFringeColorsNxM ends_________________
