function parseSensors(list) {
    return list
        .toLowerCase()
        .split('\n')
        .filter(Boolean)
        .map(el => el.match(/[xy]=-?\d+,\s*[xy]=-?\d+/g).map(em => em.match(/-?\d+/g).map(Number)));
}

function calcNotExistPositions(list, y) {
    const sensors = parseSensors(list);

    const ranges = splitRange(
        getSensorRangesInRow(sensors, y),
        [...new Set(sensors
            .map(el => el[1])
            .reduce((res, curr) => curr[1] === y ? [...res, curr[0]] : res, []))],
        1
    );

    return ranges.reduce((res, curr) => res + (curr[1] - curr[0] + 1), 0);
}
function calcTuningFrequency(list, maxSide) {
    const sensors = parseSensors(list);

    let res = null;
    heavyOperation('Tuning Frequency', 0, maxSide, 500, i => {
        const currRange = splitRange(
            getSensorRangesInRow(sensors, i), [0, maxSide]
        ).filter(el => el[0] >= 0 && el[1] <= maxSide);

        for (let j = 1; j < currRange.length; j++) {
            if (currRange[j - 1][1] + 2 === currRange[j][0]) {
                res = (currRange[j - 1][1] + 1) * 4000000 + i;
                return true;
            }
        }
    });

    return res;
}

function getSensorRowBeaconRange(y, sensorCoords, beaconCoords) {
    const xDelta = Math.abs(sensorCoords[0] - beaconCoords[0]);
    const yDelta = Math.abs(sensorCoords[1] - beaconCoords[1]);
    const mnhDist = xDelta + yDelta;

    const rowYDelta = Math.abs(y - sensorCoords[1]);
    if (rowYDelta > mnhDist) return [null, null];

    const cellXDelta = Math.abs(xDelta + yDelta - rowYDelta);
    return [sensorCoords[0] - cellXDelta, sensorCoords[0] + cellXDelta];
}
function getSensorRangesInRow(sensors, y) {
    return mergeRanges(sensors.map(el => getSensorRowBeaconRange(y, ...el)));
}

function mergeRanges(ranges) {
    const res = [];

    for (const curr of ranges.sort((a, b) => a[0] - b[0])) {
        if (curr[0] === null || curr[1] === null) continue;
        const prev = res.at(-1);

        if (prev && curr[0] <= prev[1]) {
            prev[0] = Math.min(curr[0], prev[0]);
            prev[1] = Math.max(curr[1], prev[1]);
        } else res.push(curr);
    }

    return res;
}
function splitRange(range, splitters, diff = 0) {
    let res = new Set(range);

    for (const spl of [...new Set(splitters)]) {
        const tempRes = new Set([...res]);
        for (const rangePart of res) {
            const splFrom = spl - diff;
            const splTo = spl + diff;
            if (rangePart[0] <= splTo && rangePart[1] >= splFrom) {
                tempRes.delete(rangePart);
                tempRes.add([rangePart[0], splFrom]);
                tempRes.add([splTo, rangePart[1]]);
            }
        }
        res = tempRes;
    }

    return [...res].filter(el => el[1] > el[0]).sort((a, b) => a[0] - b[0]);
}

function heavyOperation(title, from, to, cycles, cbFn) {
    const maxIter = to - from;
    const cycleIters = ~~(maxIter / cycles);

    const getCycleMax = cyc => cyc === cycles - 1 ? maxIter : (cyc + 1) * cycleIters - 1;
    const cycleInfo = cyc => `${cyc * cycleIters} to ${getCycleMax(cyc)} of ${maxIter} (cycle ${cyc + 1}/${cycles} ~ ${((cyc / cycles) * 100).toFixed(1)}% done)`;

    console.log(`${title}: Started heavy operation`)
    for (let i = 0; i < cycles; i++) {
        console.log(`${title}: ${cycleInfo(i)}`);
        let finished;
        const currMax = getCycleMax(i);
        for (let j = i * cycleIters; j <= currMax; j++) {
            finished = cbFn(j + from);
            if (finished) break;
        }
        if (finished) break;
    }
    console.log(`${title}: 100% done. Finished!`);
}
