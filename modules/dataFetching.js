//Module to work with exernal data (primarly getting main leaderboard data)

/*DEPENDENCIES
dataDisplaying.js
dataProcessing.js
userInteractions.js
*/

//"Public" function to load zlib-compressed json data (expected callback function - "processJSON")
function loadCompressedJSON(jsonFile, callback) {
    fetch(jsonFile)
        .then(response => response.arrayBuffer())
        .then(compressedData => {
            const decompressedData = pako.inflate(new Uint8Array(compressedData), {
                to: 'string'
            });
            const jsonData = JSON.parse(decompressedData);
            callback(jsonData);
        })
        .catch(error => {
            console.error('Error loading and decompressing JSON:', error);
        });
}

//"Public" function (callback) to process JSON data of main leaderboard
function processJSON(data) {
    const newArray = data.map(entry => ({
        leaderboardType: entry[0],
        width: entry[1],
        height: entry[2],
        gameMode: entry[3],
        displayType: entry[4],
        nameFilter: entry[5],
        time: entry[6],
        moves: entry[7],
        tps: entry[8],
        avglen: entry[9],
        controls: entry[10],
        timestamp: entry[11],
    }));
    leaderboardData = newArray;
    fullUniqueNames = getUniqueNames(leaderboardData).sort();
    addListenersToElements();
    lastestRecordTime = formatTimestampWithTime(getHighestTimestampValue(leaderboardData));
    radio4.checked = true; //ctrl+T bug fix
    loadCompressedJSON(solveDataPath, processSolveData);
}

//"Public" function for sending request for processing data based on request
function sendMyRequest() {
    NxNWRsContainer.innerHTML = "";
    tooltip.style.display = 'none';
    NxMSelected = totalWRsAmount;
    usernameInput.style.display = 'none';
    radio_allGameModsLabel.style.display = 'none';
    radio_allGameModsLabelInteresting.style.display = 'none';
    radio_allGameModsLabelNMSingles.style.display = 'none';
    tierLimiterTab.style.display = 'none';
    tooltip.classList.remove(...tooltip.classList);
    solveTypeDiv.style.display = 'block';
    let sheetType = request.height;
    if ((request.gameMode === "All Solve Types" || request.gameMode === "Interesting" || request.gameMode === "Standard Singles") && (sheetType !== "History")) {
        radiostandardgamemode.checked = true;
        request.gameMode = "Standard";
    }
    let cleanedData = filterDataByRequest(leaderboardData, request);
    if (sheetType === squaresSheetType) {
        processSquareRecordsData(cleanedData, sheetType);
    } else if (sheetType === "All") {
        processNxMRecordsData(cleanedData);
    } else if (String(sheetType).includes("Rankings")) {
        processRankingsData(cleanedData, sheetType);
    } else if (sheetType === "History") {
        processHistoryData(cleanedData);
    } else {
        processNormalLeaderboard(cleanedData);

    }
    updateSelectSizes();
}

//"Public" function to extract items for current leaderboard from data object list based on request
function filterDataByRequest(data, request) {
    if (String(request.width)
        .includes("Rankings")) {
        return data.filter(entry => {
            return (
                (request.leaderboardType === entry.leaderboardType) &&
                (request.displayType === entry.displayType)
            );
        });
    }
    if (request.width === "History") {
        return data.filter(entry => {
            return (
                (request.leaderboardType === entry.leaderboardType) &&
                (request.displayType === entry.displayType) &&
                ((entry.width > 2) || (entry.height > 2)) && (
                    (request.gameMode === "All Solve Types") ||
                    (request.gameMode === entry.gameMode) ||
                    (request.gameMode === "Interesting" &&
                        ( //intesrting are only squares
                            (entry.width === entry.height)
                        ) &&
                        ( //limitations on avglen based on gamemode
                            (entry.gameMode === "Standard") || //no limitations on standard
                            (entry.gameMode === "BLD") || //no limitations on BLD
                            (entry.avglen === 1) //for all other check that it is not average
                        ) &&
                        ( //limitations for bad marathons
                            (!entry.gameMode.includes("Marathon")) || //not a marathon
                            (entry.gameMode === "Marathon 10") || //allow marathon 10
                            (entry.gameMode === "Marathon 42") || //alow marathon 42
                            (entry.gameMode.length > 11) //11 means any marathon 100 or longer ("Marathon 100" string length)
                        )
                    ) ||
                    (request.gameMode === "Standard Singles") &&
                    (
                        (entry.avglen === 1) &&
                        (entry.gameMode === "Standard")
                    )
                )
            );
        });
    }
    if (request.width === "All") {
        return data.filter(entry => {
            return (
                (request.leaderboardType === entry.leaderboardType) &&
                ((entry.width > 2) || (entry.height > 2)) &&
                (request.gameMode === entry.gameMode) &&
                (request.displayType === entry.displayType) &&
                (entry.avglen === 1) &&
                (request.nameFilter === "" || entry.nameFilter.toLowerCase() === request.nameFilter.toLowerCase())
            );
        });
    }
    if (request.width === squaresSheetType) {
        return data.filter(entry => {
            return (
                (request.leaderboardType === entry.leaderboardType) &&
                (entry.width > 2) && (entry.height > 2) &&
                (entry.width === entry.height) &&
                (request.gameMode === entry.gameMode) &&
                (request.displayType === entry.displayType) &&
                (request.nameFilter === "" || entry.nameFilter.toLowerCase() === request.nameFilter.toLowerCase())
            );
        });
    }
    return data.filter(entry => {
        return (
            (request.leaderboardType === entry.leaderboardType) &&
            (request.width === entry.width) &&
            (request.height === entry.height) &&
            (request.gameMode === entry.gameMode) &&
            (request.displayType === entry.displayType)

        );
    });
}

//"Public" function to get solution string from solveData, -1 if no solution found
function getSolutionForScore(item) {
    for (const itemX of solveData) {
        if (itemX.moves === item.moves && itemX.timestamp === item.timestamp && itemX.time === item.time) {
            return itemX.solution;
        }
    }
    return -1;
}

//"Public" function to compress array to a URL-safe-string
function compressArrayToString(inputArray) {
    const jsonString = JSON.stringify(inputArray);
    const compressedArray = pako.deflate(new TextEncoder().encode(jsonString), { level: 9 });
    const compressedString = btoa(String.fromCharCode(...compressedArray));
    return encodeURIComponent(compressedString);
}

//"Public" function to decompress string, compressed with compressArrayToString function into array
function decompressStringToArray(compressedString) {
    try {
        const decodedString = decodeURIComponent(compressedString);
        const compressedArray = new Uint8Array(atob(decodedString).split('').map(char => char.charCodeAt(0)));
        const jsonString = new TextDecoder().decode(pako.inflate(compressedArray));
        return JSON.parse(jsonString);
    } catch (error) {
        alert(errorDecompressingURL);
        window.location.href = window.location.origin + window.location.pathname;
    }
}

//_________________End of "Public" functions of this module_________________//

//_________________"Private" functions for loadCompressedJSON_________________

function processSolveData(data) {
    const newArray = data.map(entry => ({
        moves: entry[0],
        time: entry[1],
        solution: entry[2],
        timestamp: entry[3]
    }));
    solveData = newArray;
    sendMyRequest();
    customRanksCheck();
    document.getElementById("controlsDiv").style.display = "block";
}

function getHighestTimestampValue(arr) {
    if (arr.length === 0) {
        return undefined;
    }
    let highestTimestamp = arr[0].timestamp;
    for (let i = 1; i < arr.length; i++) {
        const currentTimestamp = arr[i].timestamp;
        if (currentTimestamp > highestTimestamp) {
            highestTimestamp = currentTimestamp;
        }
    }
    return highestTimestamp;
}

//_________________"Private" functions for loadCompressedJSON ends_________________
