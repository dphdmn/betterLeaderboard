//Module for processing leaderboard data, preparing it for displaying on sheets

/*DEPENDENCIES
dataDisplaying.js
dataFetching.js
userInteractions.js
*/

//"Public" function to process NxN Records data
function processSquareRecordsData(cleanedData) {
    let organizedLists;
    let sortedLists;
    let controlsFilteredLists;
    rankingTabs.style.display = "none";
    usernameInput.style.display = "block";
    organizedLists = organizeData(cleanedData);
    sortedLists = sortData(organizedLists, request.leaderboardType);
    sortedLists = sortData(sortedLists, "size");
    controlsFilteredLists = getSquareWRs(sortedLists, controlType);
    combinedList.length = 0;
    NxNRecords.length = 0;
    NxNRecords = controlsFilteredLists;
    for (const key in controlsFilteredLists) {
        if (controlsFilteredLists.hasOwnProperty(key)) {
            combinedList.push(...controlsFilteredLists[key]);
        }
    }
    if (request.nameFilter !== "") {
        //if there is a name, we should prepare more data to get WRs using modified request
        tierLimiterTab.style.display = "block";
        let modifiedRequest = {
            ...request,
            nameFilter: ""
        };
        cleanedData = filterDataByRequest(leaderboardData, modifiedRequest);
        organizedLists = organizeData(cleanedData);
        sortedLists = sortData(organizedLists, request.leaderboardType);
        WRsDataForPBs = getSquareWRs(sortedLists, controlType);
    }
    createSheet(NxNRecords, squaresSheetType);
}

//"Public" function to process NxM Records data
function processNxMRecordsData(cleanedData) {
    let organizedLists;
    let sortedLists;
    let controlsFilteredLists;
    rankingTabs.style.display = "none";
    usernameInput.style.display = "block";
    organizedLists = cleanedData; //Already only singles
    sortedLists = sortData(organizedLists, request.leaderboardType);
    if (controlType === "both") {
        controlType = "unique";
    }
    controlsFilteredLists = getAllWRs(sortedLists, controlType);
    NxMRecords.length = 0;
    NxMRecords = controlsFilteredLists;
    if (request.nameFilter !== "") {
        //if there is a name, we should prepare more data to get WRs using modified request
        tierLimiterTab.style.display = "block";
        let modifiedRequest = {
            ...request,
            nameFilter: ""
        };
        organizedLists = filterDataByRequest(leaderboardData, modifiedRequest);
        sortedLists = sortData(organizedLists, request.leaderboardType);
        WRsDataForPBs = getAllWRs(sortedLists, controlType);
    }
    createSheetNxM(NxMRecords);
}

//"Public" function to process Kinch Rankings data
function processRankingsData(cleanedData, rankingsType) {
    let organizedLists;
    let sortedLists;
    let controlsFilteredLists;
    const sheetType = rankingsType;
    tierLimiterTab.style.display = "block";
    solveTypeDiv.style.display = "none";
    let uniqueNames = getUniqueNames(cleanedData);
    let rankList = [];
    if (sheetType === "Rankings") {
        rankingTabs.style.display = "none";
        rankList = rankListMain;
    }
    if (sheetType === "Rankings2") {
        rankingTabs.style.display = "none";
        rankList = getPopularList(cleanedData, controlType, categories = lastSliderValue, onlySquares = lastSquaresCB);
    }
    if (sheetType === "Rankings3") {
        rankingTabs.style.display = "block";
        rankList = customRankList;
    }
    organizedLists = organizeInRanks(cleanedData, rankList);
    sortedLists = sortData(organizedLists, request.leaderboardType);
    if (controlType === "both") {
        controlType = "unique";
    }
    controlsFilteredLists = filterListsByControlType(sortedLists, controlType);
    let playerScores = getKinchRankings(uniqueNames, controlsFilteredLists, request.leaderboardType, percentageTable, weight);
    createSheetRankings(playerScores);
}

//"Public" function to create custom ranks from user input
function changeCustomRanks() {
    let userInput = parseCommaSeparatedString(customRankingsArea.value);
    customRankList = generateRanksFromCategories(userInput);
    sendMyRequest();
}

//"Public" function to generate a link for a custom ranks from user input
function shareCustomRanks() {
    return window.location.origin + window.location.pathname + "?customRanks=" + compressArrayToString([customRankingsArea.value]);
}

//"Public" function to check for a custom ranks in URL as "customRanks" parameter
function customRanksCheck() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("customRanks")) {
        const customRanksData = decompressStringToArray(urlParams.get("customRanks"));
        const customRanksString = customRanksData[0];
        customRankingsArea.value = customRanksString;
        customRankingsRadio.checked = true;
        changePuzzleSize("Rankings3");
        changeCustomRanks();
    }
}

//"Public" function to process Latest Records data
function processHistoryData(cleanedData) {
    let organizedLists;
    let sortedLists;
    usernameInput.style.display = "block";
    tierLimiterTab.style.display = "block";
    radio_allGameModsLabel.style.display = "block";
    radio_allGameModsLabelInteresting.style.display = "block";
    radio_allGameModsLabelNMSingles.style.display = "block";
    rankingTabs.style.display = "none";
    organizedLists = organizeData(cleanedData);
    sortedLists = sortData(organizedLists, request.leaderboardType);
    sortedLists = filterControlMany(sortedLists, controlType);
    let allWRsLists = getAllWRsMultiple(sortedLists);
    let AllWRsMerged = [].concat(...Object.values(allWRsLists));
    let AllRecordsMerged = [].concat(...Object.values(sortedLists));
    if (request.nameFilter !== "") {
        const lowercaseRequestNameFilter = request.nameFilter.toLowerCase();
        AllRecordsMerged = AllRecordsMerged.filter(function (item) {
            const lowercaseItemNameFilter = item.nameFilter.toLowerCase();
            return lowercaseItemNameFilter === lowercaseRequestNameFilter;
        });
    }
    if (controlType === "unique") {
        AllRecordsMerged = removeWorseItems(AllRecordsMerged, request);
    }
    createSheetHistory(sortData(AllRecordsMerged, "timestamp"), AllWRsMerged);
}

//"Public" function to process data for regular leaderboard
function processNormalLeaderboard(cleanedData) {
    let organizedLists;
    let sortedLists;
    let controlsFilteredLists;
    rankingTabs.style.display = "none";
    organizedLists = organizeData(cleanedData);
    sortedLists = sortData(organizedLists, request.leaderboardType);
    controlsFilteredLists = filterListsByControlType(sortedLists, controlType);
    createSheet(controlsFilteredLists, -1);
}

//"Public" function (helper) to get list of unique usernames from list of items
function getUniqueNames(somelist) {
    return [...new Set(somelist.map(item => item.nameFilter))];
}

//"Public" function to check if score item is invalid based on scoreType
function isInvalid(myvalue, scoreType) {
    if (scoreType === "Moves") {
        return (myvalue === 1000 || myvalue === 2000);
    }
    if (scoreType === "Time") {
        return (myvalue > -1 && myvalue < 1);
    }
    if (scoreType === "TPS") {
        return myvalue > 10000000;
    }
}

//_________________End of "Public" functions of this module_________________//

//_________________"Private" functions (multiple usage)_________________

function organizeData(data) {
    const lists = {
        Single: [],
        ao5: [],
        ao12: [],
        ao50: [],
        ao100: []
    };

    data.forEach(item => {
        switch (item.avglen) {
            case 1:
                lists.Single.push(item);
                break;
            case 5:
                lists.ao5.push(item);
                break;
            case 12:
                lists.ao12.push(item);
                break;
            case 50:
                lists.ao50.push(item);
                break;
            case 100:
                lists.ao100.push(item);
                break;
            default:
                break;
        }
    });
    return lists;
}

function sortData(lists, sortfactor) {
    let sortField;
    if (sortfactor === 'time') {
        sortField = 'time';
        percentageTable = percentageTableTime;
    } else if (sortfactor === 'move') {
        sortField = 'moves';
        percentageTable = percentageTableMoves;
    } else if (sortfactor === 'tps') {
        sortField = 'tps';
        percentageTable = percentageTableTPS;
    } else if (sortfactor === 'size') { //!ONLY FOR SQUARES! 
        sortField = 'width';
    } else if (sortfactor === 'timestamp') {
        sortField = 'timestamp';
    } else {
        throw new Error(`Invalid sortfactor: ${sortfactor}`);
    }
    if (isArrayOfObjects(lists)) {
        //silly code to adapt for 1-list entry
        lists = sortList(lists, sortField);
    } else {
        for (const key in lists) {
            lists[key] = sortList(lists[key], sortField);
        }
    }
    return lists;
}

function isArrayOfObjects(arr) {
    return Array.isArray(arr) && arr.length > 0 && typeof arr[0] === 'object';
}

function sortList(mylist, sortField) {
    return mylist.sort((a, b) => {
        if (sortField === 'tps' || sortField === 'timestamp') {
            return b[sortField] - a[sortField];
        } else {
            return a[sortField] - b[sortField];
        }
    });
}

function filterListsByControlType(lists, controlType) {
    if (controlType === "both") {
        return lists;
    }
    const filteredLists = {};
    for (const key in lists) {
        if (lists.hasOwnProperty(key)) {
            const originalList = lists[key];
            let filteredList;
            if (controlType === "mouse") {
                filteredList = filterByMouse(originalList);
            } else if (controlType === "keyboard") {
                filteredList = filterByKeyboard(originalList);
            } else if (controlType === "unique") {
                filteredList = filterByUnique(originalList);
            }
            filteredLists[key] = filteredList;
        }
    }
    return filteredLists;
}

function filterByMouse(originalList) {
    return originalList.filter(item => item.controls === "Mouse");
}

function filterByKeyboard(originalList) {
    return originalList.filter(item => item.controls === "Keyboard");
}

function filterByUnique(originalList) {
    const nameFilterSet = new Set();
    return originalList.filter(item => {
        if (!nameFilterSet.has(item.nameFilter)) {
            nameFilterSet.add(item.nameFilter);
            return true;
        }
        return false;
    });
}

function filterByUniqueSize(originalList) {
    const myset = new Set();
    return originalList.filter(item => {
        mysize = item.width + "x" + item.height;
        if (!myset.has(mysize)) {
            myset.add(mysize);
            return true;
        }
        return false;
    });
}

//_________________"Private" functions (multiple usage) ends_________________

//_________________"Private" functions for processSquareRecordsData_________________

function getSquareWRs(lists, controlType) {
    const filteredLists = {
        Single: [],
        ao5: [],
        ao12: [],
        ao50: [],
        ao100: []
    };
    for (const key in lists) {
        if (lists.hasOwnProperty(key)) {
            const originalList = lists[key];
            let filteredList;
            if (controlType === "mouse") {
                filteredList = filterByMouse(originalList);
                filteredLists[key] = filteredList;
            } else if (controlType === "keyboard") {
                filteredList = filterByKeyboard(originalList);
                filteredLists[key] = filteredList;
            } else {
                filteredLists[key] = originalList;
            }
        }
    }
    const WRLists = {
        Single: [],
        ao5: [],
        ao12: [],
        ao50: [],
        ao100: []
    };
    for (const key in filteredLists) {
        if (filteredLists.hasOwnProperty(key)) {
            const originalList = filteredLists[key];
            let WRList = filterBySquares(originalList);
            WRLists[key] = WRList;
        }
    }
    return WRLists;
}

function filterBySquares(originalList) {
    const squaresSet = new Set();
    return originalList.filter(item => {
        if (!squaresSet.has(item.width)) {
            squaresSet.add(item.width);
            return true;
        }
        return false;
    });
}

//_________________"Private" functions for processSquareRecordsData ends_________________

//_________________"Private" functions for processNxMRecordsData_________________

function getAllWRs(originalList, controlType) {
    let filteredList;
    if (controlType === "mouse") {
        filteredList = filterByMouse(originalList);
    } else if (controlType === "keyboard") {
        filteredList = filterByKeyboard(originalList);
    } else {
        filteredList = originalList;
    }
    return filterByUniqueSize(filteredList);
}

//_________________"Private" functions for processNxMRecordsData ends_________________

//_________________"Private" functions for processRankingsData_________________

function organizeInRanks(cleanedData, rankList) {
    const lists = {};
    for (const item of rankList) {
        lists[item.id] = [];
    }
    for (const data of cleanedData) {
        const matchingItem = rankList.find(item =>
            item.width === data.width &&
            item.height === data.height &&
            item.avglen === data.avglen &&
            item.gameMode === data.gameMode
        );
        if (matchingItem) {
            lists[matchingItem.id].push(data);
        }
    }
    return lists;
}

function getKinchRankings(uniqueNames, scoresLists, scoreType, percentageTable, weight) {
    function getMainValue(score, scoreType) {
        if (scoreType === scoreTypes["time"]) {
            return score.time
        }
        if (scoreType === scoreTypes["move"]) {
            return score.moves
        }
        if (scoreType === scoreTypes["tps"]) {
            return score.tps
        }
    }
    let reverse = false;
    scoreType = scoreTypes[scoreType];
    if (scoreType === scoreTypes["tps"]) {
        reverse = true;
        defaultScore = 0.000000001;
    }
    bestValues = null;
    bestValues = {};
    for (const key in scoresLists) {
        if (scoresLists.hasOwnProperty(key)) {
            const scoreList = scoresLists[key];
            if (scoreList.length === 0) {
                bestValues[key] = defaultScore;
            } else {
                bestValues[key] = getMainValue(scoreList[0], scoreType);
                //bestValues[key] = calculateAverage(scoreList, scoreType, 0.035); //experimenting
            }
        }
    }
    function getScore(name, scoresList) {
        const foundItem = scoresList.find(item => item.nameFilter === name);
        if (foundItem) {
            return foundItem;
        } else {
            return defaultScore;
        }
    }
    function getMainScore(scoreInfo, scoreType) {
        if (scoreInfo === defaultScore) {
            return defaultScore;
        }
        return getMainValue(scoreInfo, scoreType);
    }
    function getPercentage(score, bestValue, reverse) {
        if (score === defaultScore) {
            return 0;
        }
        return calculatePercentage(score, bestValue, reverse);
    }
    function getScoreTier(scorePercentage) {
        return getClassBasedOnPercentage(scorePercentage, percentageTable);
    }
    function getPlayersPower(scores, weight, scoreType) {
        let sum = 0;
        let count = 0;
        let scoreTypeNew = request.leaderboardType;
        if (scoreTypeNew === "move") {
            scoreTypeNew = "Moves"
        }
        if (scoreTypeNew === "time") {
            scoreTypeNew = "Time"
        }
        if (scoreTypeNew === "tps") {
            scoreTypeNew = "TPS"
        }
        scores.forEach(score => {
            const bestValue = bestValues[score.id];
            if (bestValue !== defaultScore && !isInvalid(bestValue, scoreTypeNew)) {
                sum += Math.pow(score.scorePercentage, weight);
                count++;
            } else{
                score.scoreTier = "unranked";
            }
        });
        if (count === 0) {
            return 0; // Avoid division by zero
        }
        return Math.pow(sum / count, 1 / weight);
    }
    function getPlayersTier(power) {
        return getClassBasedOnPercentage(power, percentageTable);
    }
    const playerObjects = uniqueNames.map(name => {
        const scores = Object.keys(scoresLists)
            .map((key) => {
                const scoresList = scoresLists[key];
                let scoreInfo = getScore(name, scoresList);
                let score = getMainScore(scoreInfo, scoreType);
                let scorePercentage = getPercentage(score, bestValues[key], reverse);
                let scoreTier = getScoreTier(scorePercentage);
                if (scorePercentage < getTierPercentageLimit()) {
                    scorePercentage = 0;
                    scoreTier = "unranked";
                    score = defaultScore;
                    scoreInfo = defaultScore;
                }
                return {
                    id: key,
                    score,
                    scoreInfo,
                    scorePercentage,
                    scoreTier
                };
            });
        const power = getPlayersPower(scores, weight);
        const allScoresAreUnranked = scores.every(scoreObj => scoreObj.scoreTier === "unranked");
        if (allScoresAreUnranked) {
            return null;
        }
        const tier = getPlayersTier(power);
        return {
            name,
            scores,
            power,
            tier
        };
    }).filter(player => player !== null);
    playerObjects.sort((a, b) => b.power - a.power);
    return playerObjects;
}

function getPopularList(scores, controlType, categoriesAmount = 1, onlySquares = false) {
    if (controlType === "mouse") {
        scores = filterByMouse(scores);
    } else if (controlType === "keyboard") {
        scores = filterByKeyboard(scores);
    }
    const categoryCountMap = new Map();
    function initializeCategory(item, category) {
        if (!onlySquares || onlySquares && (
            ( //intesrting are only squares
                (item.width === item.height)
            ) &&
            ( //limitations on avglen based on gamemode
                (item.gameMode === "Standard") || //no limitations on standard
                (item.gameMode === "BLD") || //no limitations on BLD
                (item.avglen === 1) //for all other check that it is not average
            ) &&
            ( //limitations for bad marathons
                (!item.gameMode.includes("Marathon")) || //not a marathon
                (item.gameMode === "Marathon 10") || //allow marathon 10
                (item.gameMode === "Marathon 42") || //alow marathon 42
                (item.gameMode.length > 11) //11 means any marathon 100 or longer ("Marathon 100" string length)
            )
        )) {
            categoryCountMap.set(category, 1);
        }
    }
    scores.forEach((item) => {
        const category = defineCategoryString(item);
        if ((item.time > 300 || item.time === -1) && (item.moves >= 2000 || item.moves === -1) && (item.width + item.height > 4)) {

            if (categoryCountMap.has(category)) {
                if (categoryCountMap.get(category) !== 0) {
                    categoryCountMap.set(category, categoryCountMap.get(category) + 1);
                } else {
                    initializeCategory(item, category);
                }
            } else {
                initializeCategory(item, category);
            }
        } else {
            categoryCountMap.set(category, 0);
        }
    });
    let validCategories = Array.from(categoryCountMap.entries())
        .filter(([_, count]) => count > 0)
        .map(([category, _]) => category);
    validCategories.sort((a, b) => categoryCountMap.get(b) - categoryCountMap.get(a));
    newMaxCategories = validCategories.length;
    validCategories = validCategories.slice(0, categoriesAmount);
    const sortedCategories = validCategories.map(category => {
        const [firstNum, secondNum] = category.split(' ')[0].split('x')
            .map(Number);
        const sortingValue = firstNum * secondNum * (firstNum + secondNum);
        return {
            category,
            sortingValue
        };
    });
    sortedCategories.sort((a, b) => a.sortingValue - b.sortingValue);
    const sortedCategoryItems = sortedCategories.map(categoryObj => categoryObj.category);
    return generateRanksFromCategories(sortedCategoryItems);
}

function generateRanksFromCategories(ids) {
    const objectsList = [];
    for (const idStr of ids) {
        const data = parseId(idStr);
        objectsList.push(data);
    }
    return objectsList;
}

function parseCommaSeparatedString(inputString) {
    return inputString.split(',').map(item => item.trim());
}

function parseId(idStr) {
    idStr = idStr.toLowerCase();
    const data = {};
    data.id = idStr;
    const widthHeightMatch = idStr.match(/(\d+)x(\d+)/);
    if (widthHeightMatch) {
        data.width = parseInt(widthHeightMatch[1]);
        data.height = parseInt(widthHeightMatch[2]);
    }
    if (idStr.includes("ao")) {
        const avglenMatch = idStr.match(/ao(\d+)/);
        data.avglen = avglenMatch ? parseInt(avglenMatch[1]) : 1;
    } else if (idStr.includes("avg")) {
        const avglenMatch = idStr.match(/avg(\d+)/);
        data.avglen = avglenMatch ? parseInt(avglenMatch[1]) : 1;
    } else {
        data.avglen = 1;
    }
    let gameMode = "Standard";
    if (idStr.includes("wrel")) {
        gameMode = "Width relay";
    } else if (idStr.includes("hrel")) {
        gameMode = "Height relay";
    } else if (idStr.includes("rel")) {
        gameMode = "2-N relay";
    } else if (idStr.includes("eut")) {
        gameMode = "Everything-up-to relay";
    } else if (idStr.includes("bld")) {
        gameMode = "BLD";
    } else {
        const marathonMatch = idStr.match(/x(\d+)/g);
        if (marathonMatch && marathonMatch.length > 1) {
            gameMode = `Marathon ${marathonMatch[1].substring(1)}`;
        }
    }
    data.gameMode = gameMode;
    return data;
}

function defineCategoryString(item) {
    const N = item.width;
    const M = item.height;
    const gameModeMap = {
        "Standard": "",
        "2-N relay": "rel-",
        "Height relay": "Hrel-",
        "Width relay": "Wrel-",
        "Everything-up-to relay": "EUT-",
        "BLD": "BLD-",
    }
    let gameMode = ""
    if (item.gameMode.includes("Marathon")) {
        gameMode = item.gameMode.replace("Marathon ", "x") + "-";
    } else {
        gameMode = gameModeMap[item.gameMode];
    }
    let avg = "";
    if (item.avglen === 1) {
        avg = "single"
    } else {
        avg = "ao" + item.avglen;
    }
    return `${N}x${M} ${gameMode}${avg}`;
}

//_________________"Private" functions for processRankingsData ends_________________

//_________________"Private" functions for processHistoryData_________________

function filterControlMany(lists, controlType) {
    if (controlType !== "mouse" && controlType !== "keyboard") {
        return lists;
    }
    const filteredLists = {};
    for (const key in lists) {
        if (lists.hasOwnProperty(key)) {
            const originalList = lists[key];
            if (controlType === "mouse") {
                filteredLists[key] = filterByMouse(originalList);
            } else if (controlType === "keyboard") {
                filteredLists[key] = filterByKeyboard(originalList);
            }
        }
    }
    return filteredLists;
}

function getAllWRsMultiple(lists) {
    const filteredLists = {};
    for (const key in lists) {
        if (lists.hasOwnProperty(key)) {
            const originalList = lists[key];
            const uniqueGameModes = {};
            originalList.forEach(item => {
                if (!uniqueGameModes[item.gameMode]) {
                    uniqueGameModes[item.gameMode] = [];
                }
                uniqueGameModes[item.gameMode].push(item);
            });
            const allGameModeData = [];
            for (const gameMode in uniqueGameModes) {
                if (uniqueGameModes.hasOwnProperty(gameMode)) {
                    const uniqueGameModeList = uniqueGameModes[gameMode];
                    const filteredList = filterByUniqueSize(uniqueGameModeList);
                    allGameModeData.push(...filteredList);
                }
            }
            filteredLists[key] = allGameModeData;
        }
    }
    return filteredLists;
}

function removeWorseItems(AllRecordsMerged, request) {
    const matchingItems = {};
    for (const item of AllRecordsMerged) {
        const key = `${item.gameMode}-${item.height}-${item.width}-${item.avglen}-${item.nameFilter}`;
        if (!matchingItems[key]) {
            matchingItems[key] = [];
        }
        matchingItems[key].push(item);
    }
    for (const key in matchingItems) {
        const items = matchingItems[key];
        if (items.length > 1) {
            let bestItem = items[0];

            for (let i = 1; i < items.length; i++) {
                const currentItem = items[i];

                if (request.leaderboardType === 'time' && currentItem.time < bestItem.time) {
                    bestItem = currentItem;
                } else if (request.leaderboardType === 'move' && currentItem.moves < bestItem.moves) {
                    bestItem = currentItem;
                } else if (request.leaderboardType === 'tps' && currentItem.tps > bestItem.tps) {
                    bestItem = currentItem;
                }
            }
            for (let i = items.length - 1; i >= 0; i--) {
                if (items[i] !== bestItem) {
                    items.splice(i, 1);
                }
            }
        }
    }
    const result = [];
    for (const key in matchingItems) {
        result.push(...matchingItems[key]);
    }
    return result;
}

//_________________"Private" functions for processHistoryData ends_________________
