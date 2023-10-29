//Module for making replay animation of sliding puzzle inside "overlay" container

/*DEPENDENCIES
dataDisplaying.js
dataFetching.js
fringeColors.js
gridsAnalysis.js
optimalSolver.js
slidingPuzzle.js
*/

//"Public" function to make replay of the puzzle (event - click event on a button if there was one)
function makeReplay(solution, event = -1, tps, width = -1, height = -1, scoreTitle = "Custom", customScramble = -1) {
    if (event !== -1) {
        event.stopPropagation();
    }
    overlay.style.display = 'flex';
    let scrambleMatrix;
    if (customScramble === -1) {
        if (width === -1 || height === -1) {
            scrambleMatrix = parseScrambleGuess(solution);
            width = scrambleMatrix[0].length;
            height = scrambleMatrix.length
        } else {
            scrambleMatrix = parseScramble(width, height, solution);
        }
    } else {
        scrambleMatrix = scrambleToPuzzle(customScramble);
        width = scrambleMatrix[0].length;
        height = scrambleMatrix.length
    }
    const cycledNumbers = getCyclesNumbers(scrambleMatrix, expandSolution(solution));
    let gridsData;
    if (!autoDetectGridsCheckbox_last) {
        gridsData = analyseGridsInitial(scrambleMatrix, expandSolution(solution), cycledNumbers);
    } else {
        gridsData = {
            "enableGridsStatus": -1,
            "width": width,
            "height": height,
            "offsetW": 0,
            "offsetH": 0
        }
    }
    const gridsStates = generateGridsStats(gridsData);
    const allFringeSchemes = getAllFringeSchemes(gridsStates);
    renderMatrix(scrambleMatrix, allFringeSchemes, gridsStates[0]);
    if (!constantTPSCheckbox_last) {
        animateMatrix(scoreTitle = scoreTitle, scrambleMatrix, solution, tps, allFringeSchemes, gridsStates);
    } else {
        animateMatrix(scoreTitle = scoreTitle, scrambleMatrix, solution, tps, allFringeSchemes, gridsStates, fasterLong = 1);
    }
}

//"Public" function to check for a solvedata of a custom replay in URL as "r" parameter
function customReplayCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("r")) {
        loadingDataNormally = false;
        loadingPlaceHolder.style.display = "none";
        const customReplayData = decompressStringToArray(urlParams.get("r"));
        const customSolution = customReplayData[0];
        const customTPS = customReplayData[1];
        const customReplayScramble = customReplayData[2];
        const customReplayMatrix = scrambleToPuzzle(customReplayScramble);
        makeReplay(customSolution, -1, customTPS, customReplayMatrix[0].length, customReplayMatrix.length, "Custom", customReplayScramble);
    }
}

//"Public" function to generate URL based on custom replay data
function shareReplay(solution, tps, stringScramble) {
    return window.location.origin + window.location.pathname + "?r=" + compressArrayToString([solution, tps, stringScramble]);
}

//"Public" function to close replay (also starts loading leaderboard data for case of URL-replay)
function closeReplay() {
    overlay.style.display = 'none';
    if (typeof stopAnimationF === 'function') {
        stopAnimationF();
    }
    if (!loadingDataNormally) {
        loadingDataNormally = true;
        loadingPlaceHolder.style.display = "flex";
        loadCompressedJSON(leaderboardDataPath, processJSON);
    }
}

//_________________End of "Public" functions of this module_________________//

//_________________"Private" functions for makeReplay_________________

function renderMatrix(matrix, allFringeSchemes, state) {
    width = matrix[0].length;
    height = matrix.length;
    popupContainer.innerHTML = '';
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
        const row = matrix[rowIndex];
        const rowElement = document.createElement('div');
        rowElement.className = 'row';
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const number = row[colIndex];
            const square = document.createElement('div');
            square.className = 'square';
            if (width > 10 || height > 10) {
                const maxSize = Math.max(width, height);
                const calculatedSquareSize = 70 / maxSize + "vh";
                const caclulatedFontSize = 35 / maxSize + "vh";
                square.style.width = calculatedSquareSize;
                square.style.height = calculatedSquareSize;
                square.style.fontSize = caclulatedFontSize;
            }
            if (number !== 0) {
                square.textContent = number;
                let colorsMatrix;
                if (state.mainColors.length === 1) {
                    //apply fringe
                    boxWidth = state.mainColors[0].width;
                    boxHeight = state.mainColors[0].height;
                    offsetW = state.mainColors[0].offsetW;
                    offsetH = state.mainColors[0].offsetH;
                    const key = `${boxWidth}x${boxHeight}`;
                    colorsMatrix = allFringeSchemes[key];
                    applyColorAny(colorsMatrix, square, number, boxWidth, boxHeight, offsetW, offsetH, width);
                } else {
                    //apply grids based on type
                    state.mainColors.forEach(function (colorState) {
                        let gridsColor;
                        if (colorState.type === cTMap["grids1"]) {
                            gridsColor = redGrids;
                        }
                        if (colorState.type === cTMap["grids2"]) {
                            gridsColor = blueGrids;
                        }
                        boxWidth = colorState.width;
                        boxHeight = colorState.height;
                        offsetW = colorState.offsetW;
                        offsetH = colorState.offsetH;
                        colorsMatrix = getMonoColors(gridsColor, boxWidth, boxHeight);
                        applyColorAny(colorsMatrix, square, number, boxWidth, boxHeight, offsetW, offsetH, width);
                    });
                    state.secondaryColors.forEach(function (secondaryColor) {
                        boxWidth = secondaryColor.width;
                        boxHeight = secondaryColor.height;
                        offsetW = secondaryColor.offsetW;
                        offsetH = secondaryColor.offsetH;
                        if (secondaryColor.type === cTMap["fringe"]) {
                            const key = `${boxWidth}x${boxHeight}`;
                            colorsMatrix = allFringeSchemes[key];
                        }
                        if (secondaryColor.type === cTMap["grids1"]) {
                            colorsMatrix = getMonoColors(redGrids, boxWidth, boxHeight);
                        }
                        if (secondaryColor.type === cTMap["grids2"]) {
                            colorsMatrix = getMonoColors(blueGrids, boxWidth, boxHeight);
                        }
                        applyColorAny(colorsMatrix, square, number, boxWidth, boxHeight, offsetW, offsetH, width, secondary = true);
                    });
                }

            }
            rowElement.appendChild(square);
        }
        popupContainer.appendChild(rowElement);
    }
}

function applyColorAny(colorsMatrix, square, number, width, height, offsetW, offsetH, mainWidth, secondary = false) {
    const row = Math.floor((number - offsetH * mainWidth - 1) / mainWidth);
    const col = (number - offsetW - 1) % mainWidth;
    if (row < height && col < width && row >= 0 && col >= 0) {
        if (secondary) {
            const color = colorsMatrix[row][col];
            const rectangle = document.createElement('div');
            rectangle.className = 'rectangle';
            rectangle.style.backgroundColor = color;
            square.appendChild(rectangle);
        } else {
            square.style.backgroundColor = colorsMatrix[row][col];
        }
    }
}

function animateMatrix(scoreTitle, matrix, solution, tps, allFringeSchemes, gridsStates, fasterLong = 0, firstMoveDelay = 500) {
    clearOptimalSolver();
    const longerFasterFactor = 2;
    let isCustomReplay = false;
    const stringScramble = puzzleToScramble(matrix);
    recOveralyContainer.style.display = "flex";
    if (solution === "") {
        recOveralyContainer.style.display = "none";
    }
    if (scoreTitle === "Custom") {
        isCustomReplay = true;
        scoreTitle = document.createElement("span");
        scoreTitle.innerHTML = `${customReplayTitleText} ${matrix[0].length}x${matrix.length} ${slidingPuzzleStringOne}`;
    }
    let k_width = fasterLong;
    let k_height = fasterLong;
    if (fasterLong === 0) {
        k_width = matrix[0].length / longerFasterFactor;
        k_height = matrix.length / longerFasterFactor;
    }
    const startingDelayMS = firstMoveDelay;
    const md = calculateManhattanDistance(matrix);
    let startTime;
    const intervalTimeMS = 1;
    if (typeof stopAnimationF === 'function') {
        stopAnimationF();
    }
    solution = expandSolution(solution);
    const repeatedLengths = getRepeatedLengths(solution);
    const solLen = solution.length;
    const baseDelayInMS = 1000000 / tps;
    const delayForMove = baseDelayInMS * solLen / (solLen - repeatedLengths.repeatedWidth - repeatedLengths.repeatedHeight + repeatedLengths.repeatedWidth / k_width + repeatedLengths.repeatedHeight / k_height);
    const shortDelayWidth = delayForMove / k_width;
    const shortDelayHeight = delayForMove / k_height;
    let delays = [delayForMove];
    let fakeTimes = [0];
    for (let moveIndex = 1; moveIndex <= solLen; moveIndex++) {
        if (solution[moveIndex] === solution[moveIndex - 1]) {
            if ('DU'.includes(solution[moveIndex])) delays.push(shortDelayHeight);
            if ('RL'.includes(solution[moveIndex])) delays.push(shortDelayWidth);
        } else {
            delays.push(delayForMove);
        }
        fakeTimes[moveIndex] = fakeTimes[moveIndex - 1] + delays[moveIndex];
    }
    let index = 0;
    let animationID = null;
    let startAnimationID = null;
    let lastState = null;
    function reverseLastMove() {
        const previousMoveIndex = index - 1;
        const moveRevrsed = mapReverseMove[solution[previousMoveIndex]];
        matrix = updateMatrix(matrix, moveRevrsed);
        state = getGridsState(gridsStates, previousMoveIndex);
        if (lastState !== state) {
            renderMatrix(matrix, allFringeSchemes, state);
            lastState = state;
        }
        index--;
    }
    function makeMove() {
        let move = solution[index];
        let nextIndex = index + 1;
        matrix = updateMatrix(matrix, move);
        const state = gridsStates[nextIndex - 1];
        if (state) {
            renderMatrix(matrix, allFringeSchemes, state);
        }
        index = nextIndex;
        return move;
    }
    function updateAnimation() {
        const currentTime = new Date()
            .getTime();
        const elapsedTime = currentTime - startTime;
        if (tps < 1000) {
            nextMoveCounter.innerHTML = nextMoveCoutDownText + ((fakeTimes[index] - elapsedTime) / 1000).toFixed(0) + " " + nextMoveCoutDownTextTwo;
        } else {
            nextMoveCounter.innerHTML = "";
        }
        while (elapsedTime > fakeTimes[index]) {
            if (index < solLen) {
                rewindSlider.value = index + 1;
                makeMove();
                updateRewindSliderMoves();
            } else {
                renderMatrix(matrix, allFringeSchemes, gridsStates[0]);
                popupContainer.insertBefore(scoreHeader, popupContainer.firstChild);
                makeReplayButton();
                stopAnimation();
                break;
            }
        }
    }
    const rewindSlider = document.createElement('input');
    rewindSlider.id = 'rewindSlider';
    rewindSlider.type = 'range';
    rewindSlider.max = solLen;
    rewindSlider.value = 0;
    rewindContainer.innerHTML = '';
    popupContainerSettings.innerHTML = '';
    popupContainerCustom.innerHTML = '';
    popupContainerCustom.style.display = "none";
    const nextMoveCounter = document.createElement('div');
    nextMoveCounter.style.margin = "5px";
    nextMoveCounter.style.fontSize = "13px";
    rewindContainer.appendChild(nextMoveCounter);
    const rewindSliderMovesLabel = document.createElement('div');
    rewindSliderMovesLabel.id = 'rewindSliderMovesLabel';
    rewindSliderMovesLabel.textContent = 'Moves: 0';
    const rewindSliderMovesTable = document.createElement('table');
    rewindSliderMovesTable.id = 'rewindSliderMovesTable';
    const tableHeaders = document.createElement('tr');
    const statsHeader = document.createElement('th');
    statsHeader.textContent = statsHeaderText;
    const currentHeader = document.createElement('th');
    currentHeader.textContent = currentHeaderText;
    const allHeader = document.createElement('th');
    allHeader.textContent = allHeaderText;
    tableHeaders.appendChild(statsHeader);
    tableHeaders.appendChild(allHeader);
    tableHeaders.appendChild(currentHeader);
    const currentTPSRow = document.createElement('tr');
    const currentTPSRowLabel = document.createElement('td');
    currentTPSRowLabel.textContent = PBTypeStrings[2];
    const currentTPSValue = document.createElement('td');
    const AllTPSValue = document.createElement('td');
    const currentMovesRow = document.createElement('tr');
    const currentMovesLabel = document.createElement('td');
    currentMovesLabel.textContent = PBTypeStrings[1];
    const currentMovesValue = document.createElement('td');
    const allMovesValue = document.createElement('td');
    const currentMDRow = document.createElement('tr');
    const currentMDLabel = document.createElement('td');
    currentMDLabel.textContent = MDString;
    const currentMDValue = document.createElement('td');
    const allMDValue = document.createElement('td');
    const currentMMDRow = document.createElement('tr');
    const currentMMDLabel = document.createElement('td');
    currentMMDLabel.textContent = mmdString;
    const currentMMDValue = document.createElement('td');
    const allMMDValue = document.createElement('td');
    const timeRow = document.createElement('tr');
    const timeLabel = document.createElement('td');
    timeLabel.textContent = PBTypeStrings[0];
    const timeCurrentValue = document.createElement('td');
    const timeAllValue = document.createElement('td');
    currentTPSRow.appendChild(currentTPSRowLabel);
    currentTPSRow.appendChild(AllTPSValue);
    currentTPSRow.appendChild(currentTPSValue);
    currentMovesRow.appendChild(currentMovesLabel);
    currentMovesRow.appendChild(allMovesValue);
    currentMovesRow.appendChild(currentMovesValue);
    currentMDRow.appendChild(currentMDLabel);
    currentMDRow.appendChild(allMDValue);
    currentMDRow.appendChild(currentMDValue);
    currentMMDRow.appendChild(currentMMDLabel);
    currentMMDRow.appendChild(allMMDValue);
    currentMMDRow.appendChild(currentMMDValue);
    timeRow.appendChild(timeLabel);
    timeRow.appendChild(timeAllValue);
    timeRow.appendChild(timeCurrentValue);
    rewindSliderMovesTable.appendChild(tableHeaders);
    rewindSliderMovesTable.appendChild(currentMovesRow);
    rewindSliderMovesTable.appendChild(currentMDRow);
    rewindSliderMovesTable.appendChild(currentMMDRow);
    rewindSliderMovesTable.appendChild(currentTPSRow);
    rewindSliderMovesTable.appendChild(timeRow);
    if (solution !== "") {
        popupContainerSettings.appendChild(rewindSliderMovesTable);
        solutionContainer = document.createElement("div");
        solutionContainer.id = "solutionContainer";
        scrambleContainer = document.createElement("div");
        popupContainerSettings.appendChild(scrambleContainer);
        popupContainerSettings.appendChild(solutionContainer);
        scrambleContainer.id = "scrambleContainer";
    }
    const originalScramble = puzzleToScramble(matrix);
    rewindContainer.appendChild(rewindSlider);
    rewindContainer.appendChild(rewindSliderMovesLabel);
    const autoDetectGridsCheckbox = document.createElement("input");
    autoDetectGridsCheckbox.type = "checkbox";
    autoDetectGridsCheckbox.id = "autoDetectGridsCheckbox";
    autoDetectGridsCheckbox.checked = autoDetectGridsCheckbox_last;
    autoDetectGridsCheckbox.addEventListener("change", function () {
        autoDetectGridsCheckbox_last = autoDetectGridsCheckbox.checked;
        if (!isCustomReplay) {
            makeReplay(solution, -1, tps, matrix[0].length, matrix.length, scoreTitle);
        } else {
            makeReplay(solution, -1, tps, matrix[0].length, matrix.length, "Custom", stringScramble);
        }
    });
    const autoDetectGridsCheckboxLabel = document.createElement("label");
    autoDetectGridsCheckboxLabel.textContent = forceFringeCBtext;
    autoDetectGridsCheckboxLabel.htmlFor = "autoDetectGridsCheckbox";
    const gridNumbers = Object.keys(gridsStates);
    if (gridNumbers.length > 1) {
        const girdButtonsHeader = document.createElement("h1");
        girdButtonsHeader.style.fontSize = "14px";
        girdButtonsHeader.textContent = gridsShortCutsHeader;
        girdButtonsHeader.style.backgroundColor = "#111";
        girdButtonsHeader.style.borderRadius = "10px";
        girdButtonsHeader.style.padding = "5px";
        popupContainerSettings.appendChild(girdButtonsHeader);
        for (const key of gridNumbers.slice(1)) {
            const button = document.createElement("button");
            button.textContent = (parseInt(key, 10) + 1).toString();
            button.style.padding = '6px';
            button.style.marginLeft = '1px';
            button.style.marginTop = 0;
            button.style.marginRight = '1px';
            button.style.display = 'inline';
            button.addEventListener("click", () => {
                rewindSlider.value = button.textContent;
                manualMoving();
            });
            popupContainerSettings.appendChild(button);
        }
        popupContainerSettings.appendChild(document.createElement("br"));
    }
    popupContainerSettings.appendChild(autoDetectGridsCheckbox);
    popupContainerSettings.appendChild(autoDetectGridsCheckboxLabel);
    const constantTPSCheckbox = document.createElement("input");
    constantTPSCheckbox.type = "checkbox";
    constantTPSCheckbox.id = "constantTPSCheckbox";
    constantTPSCheckbox.checked = constantTPSCheckbox_last;
    constantTPSCheckbox.addEventListener("change", function () {
        constantTPSCheckbox_last = constantTPSCheckbox.checked;
        if (!isCustomReplay) {
            makeReplay(solution, -1, tps, matrix[0].length, matrix.length, scoreTitle);
        } else {
            makeReplay(solution, -1, tps, matrix[0].length, matrix.length, "Custom", stringScramble);
        }
    });
    const constantTPSCheckboxLabel = document.createElement("label");
    constantTPSCheckboxLabel.textContent = constantTPSCheckboxText;
    constantTPSCheckboxLabel.htmlFor = "constantTPSCheckbox";
    popupContainerSettings.appendChild(constantTPSCheckbox);
    popupContainerSettings.appendChild(constantTPSCheckboxLabel);
    if (!isCustomReplay) {
        createCustomBasedOnThatButton = document.createElement("button");
        createCustomBasedOnThatButton.textContent = createCustomReplayButtonText;
        createCustomBasedOnThatButton.addEventListener("click", function (event) {
            makeReplay(solution, event, tps, matrix[0].length, matrix.length);
        });
        createCustomBasedOnThatButton.style.marginTop = "30px";
        popupContainerSettings.appendChild(createCustomBasedOnThatButton);
    } else {
        //custom replay mode
        popupContainerCustom.style.display = "block";
        const customHeader = document.createElement("div");
        customHeader.textContent = customReplaySettingsHeader;
        popupContainerCustom.appendChild(customHeader);
        customHeader.style.fontWeight = "bold";
        let newSolution;
        let newWidth = -1;
        let newHeight = -1;
        let customScramble = -1;
        let newTPS = tps;
        function changeReplay() {
            newSolution = customSoltuionArea.value.replace(/[^RULD0123456789]/g, '').replace(/\s/g, '');
            let invalidScrambleState = false;
            if (customScrambleArea.value !== '') {
                const pattern = /(\d+)x(\d+)/;
                const match = customScrambleArea.value.match(pattern);
                if (match && parseInt(match[1]) >= 2 && parseInt(match[2]) >= 2) {
                    newWidth = parseInt(match[1]);
                    newHeight = parseInt(match[2]);
                } else {
                    let newCustomScrambleValue = customScrambleArea.value.replace(/\s+/g, ' ').trim();
                    if (validateScramble(newCustomScrambleValue)) {
                        customScramble = newCustomScrambleValue;
                    } else {
                        invalidScrambleState = true;
                        alert(errorInvalidScramble);
                    }
                }
            } else {
                customScramble = -1;
            }
            const typedNewTPS = parseFloat(tpsInputArea.value);
            if (!isNaN(typedNewTPS)) {
                newTPS = Math.floor(typedNewTPS * 1000);
            } else {
                alert(errorInvalidTPS);
            }
            if (newSolution.length > 0 && !invalidScrambleState) {
                try {
                    makeReplay(newSolution, -1, newTPS, newWidth, newHeight, "Custom", customScramble);
                } catch (error) {
                    if (error.message.includes("Invalid move") || error.message.includes("Unexpected move character")) {
                        alert(errorNotApplicable + error.message);
                    } else {
                        alert(errorSolutionUnexpected);
                    }
                }
            }
        }
        const customSoltuionArea = document.createElement("textarea");
        customSoltuionArea.value = compressSolution(solution);
        customSoltuionArea.classList.add("text-input");
        customSoltuionArea.style.maxWidth = "400px";
        customSoltuionArea.style.minHeight = "150px";
        customSoltuionArea.placeholder = solutioncustomPlaceholder;
        customSoltuionArea.addEventListener("change", changeReplay);
        const TPSInputSpan = document.createElement("span");
        TPSInputSpan.textContent = TPSinputPlaceholder;
        const tpsInputArea = document.createElement("input");
        tpsInputArea.classList.add("inputText");
        tpsInputArea.type = "text";
        tpsInputArea.style.width = "50px"
        tpsInputArea.placeholder = PBTypeStrings[2];
        tpsInputArea.value = tps / 1000;
        tpsInputArea.addEventListener("change", changeReplay);
        const customScrambleArea = document.createElement("textarea");
        if (solution !== "") {
            customScrambleArea.value = stringScramble;
        }
        customScrambleArea.classList.add("text-input");
        customScrambleArea.style.maxWidth = "400px";
        customScrambleArea.style.minHeight = "100px";
        customScrambleArea.style.marginTop = "30px";
        customScrambleArea.placeholder = customScramblePlaceholder;
        customScrambleArea.addEventListener("change", changeReplay);
        const shareReplayButton = document.createElement("button");
        shareReplayButton.textContent = copyReplayButtonText;
        shareReplayButton.addEventListener("click", function () {
            const shareReplayLink = shareReplay(solution, newTPS, stringScramble);
            navigator.clipboard.writeText(shareReplayLink)
                .then(() => {
                    const copiedMessage = document.createElement("div");
                    copiedMessage.textContent = linkCopiedSuccsess;
                    copiedMessage.style.position = "fixed";
                    copiedMessage.style.background = "rgba(0, 0, 0, 0.7)";
                    copiedMessage.style.color = "white";
                    copiedMessage.style.padding = "10px";
                    copiedMessage.style.borderRadius = "5px";
                    copiedMessage.style.textAlign = "center";
                    copiedMessage.style.top = "50%";
                    copiedMessage.style.left = "50%";
                    copiedMessage.style.transform = "translate(-50%, -50%)";
                    copiedMessage.style.zIndex = "999";
                    document.body.appendChild(copiedMessage);
                    setTimeout(() => {
                        copiedMessage.style.transition = "opacity 0.5s";
                        copiedMessage.style.opacity = "0";
                        setTimeout(() => {
                            document.body.removeChild(copiedMessage);
                        }, 500);
                    }, 1000);
                })
                .catch((error) => {
                    console.error("Copy failed: ", error);
                });
        });
        popupContainerCustom.appendChild(customScrambleArea);
        popupContainerCustom.appendChild(TPSInputSpan);
        popupContainerCustom.appendChild(tpsInputArea);
        popupContainerCustom.appendChild(customSoltuionArea);
        if (solution !== "") {
            popupContainerCustom.appendChild(shareReplayButton);
        }
        if (matrix.length === 4 && matrix[0].length === 4 && solution !== "") {
            let puzzleToSolve = originalScramble;
            let newFakeSize = "4x4";
            /* Does not work because not always the same... shame
            if (matrix.length !== 4 || matrix[0].length !== 4){
                puzzleToSolve = puzzleToScramble(expandMatrix(scrambleToPuzzle(originalScramble), 4, 4));
                console.log(puzzleToSolve);
                newFakeSize = `${matrix[0].length}x${matrix.length}`;
            }*/
            if (alreadyOptimalReplay) {
                alreadyOptimalReplay = false;
                const optimalSpan = document.createElement("h1");
                optimalSpan.style.fontSize = "16px";
                optimalSpan.textContent = optSolverAfterOptimalTitle;
                popupContainerCustom.appendChild(optimalSpan);
            } else {
                optimalButton = document.createElement("button");
                popupContainerCustom.appendChild(optimalButton);
                optimalButton.textContent = optSolverGetOptimal;
                optimalButton.addEventListener("click", solveOptimally);
                let solutionDelay = 3000;
                function solveOptimally() {
                    solvingScrambleState = true;
                    optimalButton.textContent = `${optSolverWait} ${(solutionDelay / 1000).toFixed(0)} ${optSolverWaitTwo}`;
                    customSoltuionArea.disabled = true;
                    customScrambleArea.disabled = true;
                    tpsInputArea.disabled = true;
                    optimalButton.disabled = true;
                    fetchOptimalSolutions(puzzleToSolve, solutionDelay)
                        .then((iframeContent) => {
                            if (solvingScrambleState) {
                                solvingScrambleState = false;
                                const solution = iframeContent[0];
                                if (solution[0] !== "\n") {
                                    if (solution !== "-1") {
                                        if (iframeContent[0].length === solLen) {
                                            optimalButton.textContent = optSolverAlreadyOpt;
                                            customSoltuionArea.disabled = false;
                                            customScrambleArea.disabled = false;
                                            tpsInputArea.disabled = false;
                                        } else {
                                            customSoltuionArea.value = iframeContent[0];
                                            customScrambleArea.value = newFakeSize;
                                            alreadyOptimalReplay = true;
                                            changeReplay();
                                        }
                                    } else {
                                        optimalButton.style.display = "none";
                                        const optimalSpan = document.createElement("h1");
                                        optimalSpan.style.fontSize = "16px";
                                        optimalSpan.textContent = optSolverTimeoutError;
                                        popupContainerCustom.appendChild(optimalSpan);
                                        customSoltuionArea.disabled = false;
                                        customScrambleArea.disabled = false;
                                        tpsInputArea.disabled = false;
                                    }
                                } else {
                                    customSoltuionArea.disabled = false;
                                    customScrambleArea.disabled = false;
                                    tpsInputArea.disabled = false;
                                    optimalButton.disabled = false;
                                    optimalButton.textContent = optSolverMoreTimeButton;
                                    solutionDelay += 6000;
                                }
                            }
                        })
                }
            }
        }
    }
    const scoreHeader = document.createElement("h2");
    scoreHeader.style.backgroundColor = "rgb(22, 22, 22)";
    scoreHeader.style.borderRadius = "15px";
    scoreHeader.style.padding = "5px";
    const replayScoreStringSpan = document.createElement("span");
    replayScoreStringSpan.textContent = `${formatTime(Math.round(fakeTimes[solLen]))} / ${solLen} / ${(tps / 1000).toFixed(3)}`;
    scoreHeader.appendChild(replayScoreStringSpan);
    scoreHeader.appendChild(document.createElement("br"));
    scoreHeader.appendChild(scoreTitle);
    popupContainer.insertBefore(scoreHeader, popupContainer.firstChild);
    function updateRewindSliderMoves() {
        popupContainer.insertBefore(scoreHeader, popupContainer.firstChild);
        const solvedSolution = compressSolution(solution.substring(0, index));
        const restSolution = solution.substring(index);
        const formattedSolution = `<span style="color:green">${solvedSolution}</span><span style="color:gray">${restSolution}</span>`
        solutionContainer.innerHTML = formattedSolution;
        scrambleContainer.innerHTML = `<span style="color:green">${originalScramble}</span><br><span style="color:gray">${puzzleToScramble(matrix)}</span>`
        const currentMoves = rewindSlider.value;
        const movesPercentage = (currentMoves * 100 / solLen).toFixed(1) + "%";
        const allMoves = solLen;
        rewindSliderMovesLabel.textContent = `${PBTypeStrings[1]}: ${currentMoves}/${solLen} (${movesPercentage})`;
        currentMovesValue.textContent = `${currentMoves} (${movesPercentage})`;
        const currentMD = calculateManhattanDistance(matrix);
        const solvedMD = md - currentMD;
        const solvedPercentage = (solvedMD * 100 / md).toFixed(1) + "%";
        const allMD = md;
        currentMDValue.textContent = `${solvedMD} (${solvedPercentage})`;
        allMDValue.textContent = `${allMD}`;
        const mmd = (solvedMD <= 0) ? highStringStats : (currentMoves / solvedMD);
        const allMMD = (solLen / allMD);
        const mmdPercentage = mmd === highStringStats ? highStringStats : ((mmd * 100 / allMMD) - 100).toFixed(1) + "%";
        currentMMDValue.textContent = `${mmd === highStringStats ? highStringStats : mmd.toFixed(3)} (${mmdPercentage})`;
        allMMDValue.textContent = `${allMMD.toFixed(3)}`;
        const allTime = formatTime(Math.round(fakeTimes[solLen]), false);
        timeCurrentValue.textContent = `${aproxValueStats} ${formatTime(Math.round(fakeTimes[index]), false)}`;
        timeAllValue.textContent = allTime;
        const predictedMovecount = (mmd === highStringStats) ? "" : "(" + (mmd * md).toFixed(0) + "?)";
        allMovesValue.textContent = `${allMoves} ${predictedMovecount}`;
        currentTPSValue.textContent = (currentMoves === "0") ? aproxValueStats + " 0.000" : `${aproxValueStats} ${(currentMoves * 1000 / fakeTimes[index]).toFixed(3)}`;
        AllTPSValue.textContent = (tps / 1000).toFixed(3);
    }
    rewindSlider.addEventListener('input', manualMoving);
    const animationButton = document.createElement('button');
    const settingsButton = document.createElement('button');
    settingsButton.style.border = "0.1vh solid #fff";
    const closeButton = document.createElement('button');
    closeButton.textContent = closeReaplyText;
    closeButton.style.backgroundColor = "rgb(200, 0, 0)";
    closeButton.style.border = "0.1vh solid #000";
    closeButton.addEventListener('click', closeReplay);
    if (popupContainerSettings.style.display === "none") {
        settingsButton.textContent = showStatsText;
    } else {
        settingsButton.textContent = hideStatsText;
    }
    function toggleSettingsVisibility() {
        if (popupContainerSettings.style.display === "none") {
            popupContainerSettings.style.display = "block";
            settingsButton.textContent = hideStatsText;
        } else {
            popupContainerSettings.style.display = "none";
            settingsButton.textContent = showStatsText;
        }
    }
    settingsButton.addEventListener('click', toggleSettingsVisibility)
    makeStopButton();
    function toggleAnimationButton() {
        if (index === solLen) {
            makeStopButton();
            for (let moveAmount = index; moveAmount > 0; moveAmount--) {
                reverseLastMove();
            }
            rewindSlider.value = 0;
            updateRewindSliderMoves();
            index = 0;
            runAnimation();
        } else {
            if (animationID) {
                stopAnimation();
                makeStartButton();
            } else {
                resumeAnimation();
                makeStopButton();
            }
        }
    }
    function makeReplayButton() {
        animationButton.textContent = replayButtonText;
        animationButton.classList.remove('pause-button');
        animationButton.classList.add('play-button');
    }
    function makeStartButton() {
        animationButton.textContent = playButtonText;
        animationButton.classList.remove('pause-button');
        animationButton.classList.add('play-button');
    }
    function makeStopButton() {
        animationButton.textContent = pauseButtonText;
        animationButton.classList.remove('play-button');
        animationButton.classList.add('pause-button');
    }
    animationButton.addEventListener('click', toggleAnimationButton);
    rewindContainer.appendChild(animationButton);
    rewindContainer.appendChild(settingsButton);
    if (solution === "") {
        popupContainerSettings.style.display = "none";
        popupContainerCustom.appendChild(closeButton);
    } else {
        rewindContainer.appendChild(closeButton);
    }
    function resumeAnimation() {
        startTime = new Date()
            .getTime() - fakeTimes[index];
        animationID = setInterval(updateAnimation, intervalTimeMS);
    }
    function runAnimation() {
        startAnimationID = setTimeout(function () {
            rewindSlider.focus();
            startTime = new Date()
                .getTime();
            animationID = setInterval(updateAnimation, intervalTimeMS);
        }, startingDelayMS);
    }
    function manualMoving() {
        stopAnimation();
        nextMoveCounter.innerHTML = "";
        const sliderValue = parseInt(rewindSlider.value);
        if (sliderValue === solLen) {
            lastState = gridsStates[0];
            renderMatrix(matrix, allFringeSchemes, lastState);
            makeReplayButton();
        } else {
            makeStartButton();
        }
        const previousIndex = index;
        if (previousIndex < sliderValue) {
            for (let moveAmount = previousIndex; moveAmount < sliderValue; moveAmount++) {
                makeMove();
            }
        } else if (previousIndex > sliderValue) {
            for (let moveAmount = previousIndex; moveAmount > sliderValue; moveAmount--) {
                reverseLastMove();
            }
        }
        updateRewindSliderMoves();
    }
    if (solution !== "") {
        updateRewindSliderMoves();
    }
    if (!isCustomReplay) {
        runAnimation();
    } else {
        makeStartButton();
    }
    function stopAnimation() {
        if (animationID !== null) {
            clearInterval(animationID);
            animationID = null;
        }
        if (startAnimationID !== null) {
            clearTimeout(startAnimationID);
            startAnimationID = null;
        }
    }
    stopAnimationF = stopAnimation;
}

function updateMatrix(matrix, movetype) {
    const width = matrix[0].length;
    const height = matrix.length;
    const zeroPos = findZero(matrix, width, height);
    updateScreen(zeroPos, movetype);
    return moveMatrix(matrix, movetype, zeroPos, width, height);
}

function updateScreen(zeroPos, movetype) {
    const zeroRow = zeroPos[0];
    const zeroCol = zeroPos[1];
    const squares = document.querySelectorAll('.square');
    const square1 = squares[zeroRow * width + zeroCol];
    const square2 =
        movetype === 'R' ? squares[zeroRow * width + zeroCol - 1] :
            movetype === 'L' ? squares[zeroRow * width + zeroCol + 1] :
                movetype === 'U' ? squares[(zeroRow + 1) * width + zeroCol] :
                    movetype === 'D' ? squares[(zeroRow - 1) * width + zeroCol] :
                        null;
    if (square2) {
        [square1.style.backgroundColor, square2.style.backgroundColor] = [square2.style.backgroundColor, square1.style.backgroundColor];
        [square1.innerHTML, square2.innerHTML] = [square2.innerHTML, square1.innerHTML];
    }
}

//_________________"Private" functions for makeReplay ends_________________
