//default values and other global variables

//default values
var NxMstyleDPH = false; //default NxM table visibility
var controlType = "unique"; //default control type selection (must be one of controlTypeSelectValues)
var lastSquaresCB = true; //default value for "only interesting popular categories"
var lastSliderValue = 20; //default value for "popular categories"
var hideEmptyTiers = true; //default value for "Hide empty tiers" in rankings pages
let tierLimit = "Any"; //default value for "show X tier scores only" (must be one of tierLabels)
let autoDetectGridsCheckbox_last = false; //default value for "Force fringe" in replays (false = don't force fringe)
let constantTPSCheckbox_last = false; //default value for "Constant TPS" in replays
let lastestRecordTime = "Unknown"; //default value for latest update time, should usually never show
var percentageTable = percentageTableTime; //default percentageTable (must be consistent with request)
let defaultScore = 999999999; //default placeholder for rankings (time / mvc)
const redGrids = "rgb(200, 103, 103)"; //default value for 1st grids
const blueGrids = "rgb(141, 179, 255)"; //default value for 2nd grids
const pinkNullColor = "rgb(248, 24, 148)"; //default value for latest element in grids-fringe
const weight = 10; //default value for kinch weight

//default request
var request = {
    displayType: "Standard",
    width: 4,
    height: 4,
    leaderboardType: "time",
    gameMode: "Standard",
    nameFilter: ""
};

//other global vars
let bestValues = {};
var NxMRecords = [];
var NxNRecords = [];
var combinedList = [];
var customRankList = [];
var stopAnimationF;
var solveData;
let loadingDataNormally = true;
let alreadyOptimalReplay = false;
let solvingScrambleState = false;
var leaderboardData;
var WRsDataForPBs;
var fullUniqueNames;
var displayTypeSelect;
var leaderboardTypeSelect;
var controlTypeSelect;
var NxMSelected;
let eventListenerReference = null;
var newMaxCategories;