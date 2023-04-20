const genCoords = arr => ({x: +arr[0], y: +arr[1]});

const chars = {
    air: '.',
    dwayneJohnson: '#', // 🤨
    sand: 'o'
};

function calcRestSandUnits(caveSlice, abyss = true) {
    const dwayneJohnsonPaths = caveSlice // 🤨
        .split('\n')
        .filter(Boolean)
        .map(path => path.split(/\s*->\s*/).filter(Boolean).map(coords => genCoords(coords.split(','))));

    const xLim = [Infinity, -Infinity];
    const yLim = [0, -Infinity];

    dwayneJohnsonPaths.forEach(path => path.forEach(coords => {
        if (coords.x < xLim[0]) xLim[0] = coords.x;
        if (coords.x > xLim[1]) xLim[1] = coords.x;
        if (coords.y < yLim[0]) yLim[0] = coords.y;
        if (coords.y > yLim[1]) yLim[1] = coords.y;
    }));

    if (!abyss) yLim[1] += 2;

    const xLen = xLim[1] - xLim[0] + 1;
    const yLen = yLim[1] - yLim[0] + 1;

    const floorPos = abyss ? Infinity : yLen - 1;
    const sandSource = genCoords([500 - xLim[0], 0 - yLim[0]]);
    const caveMap = new Array(yLen).fill(null).map(
        () => Object.assign({}, new Array(xLen).fill(chars.air))
    );

    dwayneJohnsonPaths.forEach(path => path.forEach((coords, idx) => {
        path[idx] = genCoords([coords.x - xLim[0], coords.y - yLim[0]]);
    }));

    dwayneJohnsonPaths.forEach(path => {
        for (let i = 1; i < path.length; i++) {
            const gridX = [path[i - 1].x, path[i].x];
            const gridY = [path[i - 1].y, path[i].y];

            if (gridX[0] === gridX[1]) for (
                let y = Math.min(...gridY);
                y <= Math.max(...gridY);
                y++
            ) caveMap[y][gridX[0]] = chars.dwayneJohnson;
            else for (
                let x = Math.min(...gridX);
                x <= Math.max(...gridX);
                x++
            ) caveMap[gridY[0]][x] = chars.dwayneJohnson;
        }
    });

    let restCount = 0;
    let currSandUnit = {...sandSource};
    let currMoveCount = 0;
    while (!abyss || currSandUnit.y <= yLen) {
        const cells = [
            genCoords([currSandUnit.x, currSandUnit.y + 1]),
            genCoords([currSandUnit.x - 1, currSandUnit.y + 1]),
            genCoords([currSandUnit.x + 1, currSandUnit.y + 1])
        ];
        let free = false;

        for (const candidate of cells) {
            const row = caveMap[candidate.y];
            const cell = row && row[candidate.x];

            if (candidate.y !== floorPos && cell !== chars.dwayneJohnson && cell !== chars.sand) {
                free = true;
                currSandUnit = {...candidate};
                break;
            }
        }

        if (!free) {
            restCount++;
            if (currMoveCount === 0) break;
            currMoveCount = 0;
            caveMap[currSandUnit.y][currSandUnit.x] = chars.sand;
            currSandUnit = {...sandSource};
        }
        else currMoveCount++;
    }

    // If you want to render:
    // caveMap[sandSource.y][sandSource.x] = '+';
    // const minCellIdx = Math.min(...caveMap.map(row => Math.min(...Object.keys(row).map(Number))));
    // const maxCellIdx = Math.max(...caveMap.map(row => Math.max(...Object.keys(row).map(Number))));
    // console.log(caveMap.map(el => new Array(maxCellIdx - minCellIdx + 1)
    //     .fill('.')
    //     .map((nw, idx) => el[idx + minCellIdx] || nw).join('')).join('\n')
    // );

    return restCount;
}
