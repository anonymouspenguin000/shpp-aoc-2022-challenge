function calcTailVisitedPosCount(ropeCount, motions) {
    return motions
        .toUpperCase() // Just in case
        .split('\n')
        .filter(Boolean)
        .reduce(
            (res, move) => {
                const [dir, steps] = move.split(' ');
                const {allTailPos, knotPositions} = res;

                for (let i = 0; i < +steps; i++) {
                    switch (dir) {
                        case 'R':
                            knotPositions[0][0]++;
                            break;
                        case 'L':
                            knotPositions[0][0]--;
                            break;
                        case 'U':
                            knotPositions[0][1]++;
                            break;
                        case 'D':
                            knotPositions[0][1]--;
                            break;
                    }

                    for (let j = 1; j < knotPositions.length; j++) {
                        const prevKnot = knotPositions[j - 1];
                        const currKnot = knotPositions[j];

                        const deltaX = prevKnot[0] - currKnot[0];
                        const deltaY = prevKnot[1] - currKnot[1];
                        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
                            currKnot[0] += Math.sign(deltaX);
                            currKnot[1] += Math.sign(deltaY);
                        }
                    }
                    allTailPos.add(JSON.stringify(knotPositions.at(-1)));
                }
                return {allTailPos, knotPositions};
            },
            {
                allTailPos: new Set([JSON.stringify([0, 0])]),
                knotPositions: new Array(ropeCount).fill(null).map(() => [0, 0])
            }
        ).allTailPos.size;
}
