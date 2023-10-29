//Core script of the leaderboard project

/*DEPENDENCIES
dataFetching.js
replayGeneration.js
*/

function main() {
    customReplayCheck();
    if (loadingDataNormally) {
        loadCompressedJSON(leaderboardDataPath, processJSON);
    }
}
main();
