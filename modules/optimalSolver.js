//Module that allows to find optimal solutions for 4x4 sliding puzzle

/*DEPENDENCIES
None
*/

//"Public" function to solve 4x4 slidysim-style scramble, recommended delay >=3000ms
async function fetchOptimalSolutions(scramble, delay) {
    const formattedScramble = scramble.replace(/[ /]/g, "_");
    const url = `${optimalSolverURL}${formattedScramble}`;
    return new Promise((resolve) => {
        const iframe = Object.assign(document.createElement("iframe"), { style: "display: none" });
        document.body.appendChild(iframe);
        iframe.src = url;
        function handleMessage(event) {
            if (event.source === iframe.contentWindow) {
                const iframeContent = event.data;
                document.body.removeChild(iframe);
                window.removeEventListener("message", handleMessage);
                resolve(iframeContent);
            }
        }
        eventListenerReference = handleMessage;
        window.addEventListener("message", handleMessage);
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow.postMessage("GetContent", "*");
            }, delay);
        };
    });
}

//"Public" function to stop the working solver (if solvingScrambleState = true)
function clearOptimalSolver() {
    if (solvingScrambleState) {
        solvingScrambleState = false;
        var iframes = document.querySelectorAll("iframe");
        for (var i = 0; i < iframes.length; i++) {
            document.body.removeChild(iframes[i]);
        }
        window.removeEventListener("message", eventListenerReference);
    }
}
