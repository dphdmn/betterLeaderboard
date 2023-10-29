//strings that can be edited if needed

const helpMessage = `- Specify size in "12x34" format. Click buttons for more format examples. Separate with ", ". Case doesn't matter.
- Use "ao5", "ao12", "ao50", or "ao100" for average. Otherwise it is single by default. ("avg" instead of "ao" also possible)
- Solve type format: "wrel" (width relay), "hrel" (height relay), "rel" (normal relay), "eut" (eut relay), "bld" (BLD), or "x123" (marathon of N).
- Only one display type is supported globally (check settings in header!).
- Use spacebar once and only after puzzle size (recommended for better look).
- Input format isn't checked, so if it can't be detected, it will be ignored.
- Player's final Kinch ranking is weighted with N = 10: AVG(X^N)^1/N (customization of it is probably not very important, but may change later).`;
const tooltipText = "Interesting records exclude the following:<br>• N≠M solves<br>• Averages for non-Standard control types (except for BLD)<br>• Marathons that are not x10, x42, or >= 100";
const PBTypeStrings = ["Time", "Moves", "TPS"];
const controlTypeSelectStrings = ["Mouse & Keyboard (Unique)", "Mouse & Keyboard", "Mouse only", "Keyboard only"];
const controlTypeSelectStringsUnique = ["Mouse & Keyboard (Unique)", "Mouse only", "Keyboard only"];
const notFoundError = `<h1 style="color:red">There are no results based on your current filters.<br><img alt="Sad Egg Image" src="images/sadegg.png"></img></h1>`
const cardHeadersNormal = '<th>#</th><th>Name</th><th>Score</th>';
const cardHeadersTier = '<th>#</th><th>Tier</th><th>Score</th>';
const requirementsString = "requirements";
const NxMNormalString = "NxM (swap!)";
const NxMSwappedString = "MxN (swap!)";
const totalWRsAmount = "Total WRs Amount";
const invalidPlaceHolderString = "{invaild}";
const exactLimitString = "Exact limit for";
const byString = " by "
const emptyTierPlaceHolder = "No one is here!";
const historyTableHeaders = ['Puzzle', 'Solve Type', 'Player', 'Score', 'Controls', 'Tier', 'Date'];
const showHistoryString = "(click to show)";
const showAllHistoryString = "Show All (can be slow!)";
const invalidTimestampStringHistory = "Before 2014 / Bugged";
const shareCustomRanksText = "Generate and Copy Link for Current Custom Rankings to Clipboard";
const linkCopiedSuccsess = "Link copied to clipboard!";
const solveByString = "solve by";
const unknownStatsShortString = "???";
const leaderboardForString = "Leaderboard for";
const worldRecordsOnNN = "World Records on NxN";
const worldRecordsOnNM = "World Records on NxM";
const slidingPuzzleString = "sliding puzzles";
const slidingPuzzleStringOne = "sliding puzzle";
const PBsPlaceHolderString = `PBs by <span id="nameSpanHeader" class="pinktext" style="font-weight: 900;"></span> on NxN`;
const PBsPlaceHolderStringNxM = `PBs by <span id="nameSpanHeader" class="pinktext" style="font-weight: 900;"></span> on NxM`;
const MainRankingsString = "Main™ Rankings of 3x3 - 10x10";
const PopularRankingsString = "Most Popular Categories of";
const customRankingsString = "Custom Rankings of";
const hisroryPageString = "Latest Records of";
const doneWithString = "Done with";
const displayTypeHeaderString = " display type, using ";
const controlsTypeHeaderString = "controls";
const lastLeaderboardUpdateString = "Last leaderboard update:";
const replayAvailableIcon = "🥚";
const defaultCounryEmoji = "🌍";
const maxCategoriesForPopularString = "Max categories amount:";
const onlyInterestingCategoriesPopular = `Only "Interesting" categroies`;
const hideEmptyTiersCheckboxText = "Hide empty tiers";
const todayString = "Today";
const weekString = "Last week";
const monthString = "Earlier this Month";
const errorDecompressingURL = `Could not parse data from the link. Please verify that it was generated properly.\nRedirecting to the main leaderboard now instead.`;
const showAnyLevelRecords = "Show any level records";
const showWRsOnly = "Show WRs only";
const showRecordsAtleast = "Show records that are at least";
const showRecordsAtleastTierWord = "tier";
const customReplayTitleText = "Custom replay for";
const nextMoveCoutDownText = "Next move in...";
const nextMoveCoutDownTextTwo = "seconds<br>(scroll or change TPS in custom mode)";
const statsHeaderText = "Stats";
const currentHeaderText = "Current";
const allHeaderText = "Total";
const MDString = "MD";
const mmdString = "Moves/MD";
const forceFringeCBtext = "Force Fringe";
const gridsShortCutsHeader = "Shortcuts for Auto-Detected Grids";
const constantTPSCheckboxText = "Constant TPS";
const createCustomReplayButtonText = "Create custom replay based on that";
const customReplaySettingsHeader = "Custom replay settings";
const errorInvalidScramble = "Your scramble is not vaild, please check your scramble.";
const errorInvalidTPS = "Your TPS value is not a number! Old value will be used.";
const errorNotApplicable = "Your solution can't be applied to the scramble!\nFirst error:\n";
const errorSolutionUnexpected = "Something is very wrong with your custom solution or scramble or size!\n\n(If you see this, it's most likely that your solution is not a valid solution for any scramble.)";
const solutioncustomPlaceholder = "Enter your solution here.";
const customScramblePlaceholder = "Enter custom scramble for your solution;\nOR Enter puzzle size (NxM) to parse full solution for size;\nOR Leave blank to parse full solution for guessed size.";
const TPSinputPlaceholder = "TPS (moves/s): ";
const copyReplayButtonText = "Copy Replay Link to Clipboard";
const optSolverAfterOptimalTitle = "Optimal solution is found!";
const optSolverGetOptimal = "Get Optimal solution";
const optSolverWait = "Please wait for";
const optSolverWaitTwo = "seconds...";
const optSolverAlreadyOpt = "Solution was already optimal!";
const optSolverTimeoutError = "Scramble is very hard, can't solve it.";
const optSolverMoreTimeButton = "Could not get optimal...\nTry again with more time?";
const highStringStats = "High";
const aproxValueStats = "(est.)";
const closeReaplyText = "Close replay";
const showStatsText = "Show stats";
const hideStatsText = "Hide stats";
const replayButtonText = "Replay";
const playButtonText = "Play";
const pauseButtonText = "Pause";
