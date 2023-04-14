function calcVisibleTreeCount(grid) {
    return grid
        .split('\n')
        .filter(Boolean)
        .reduce((rs, cr, idx, arrA) => rs + [...cr].map(Number).reduce(
            (res, curr, jdx, arrB) => res + (
                !idx || [arrA.slice(0, idx), arrA.slice(idx + 1)].some(arr => arr.every(el => +el[jdx] < curr)) ||
                !jdx || [arrB.slice(0, jdx), arrB.slice(jdx + 1)].some(arr => arr.every(el => el < curr))
            ),
            0), 0);
}
function calcMaxScenicScore(grid) {
    return grid
        .split('\n')
        .filter(Boolean)
        .reduce((rs, cr, idx, arrA) => Math.max(rs, [...cr].map(Number).reduce(
            (res, curr, jdx, arrB) => {
                // ScSc = Scenic Score
                const scscA = [arrA.slice(0, idx).reverse(), arrA.slice(idx + 1)].map(arr => arr.reduce(
                    (rs, el) => rs.brk
                        ? rs
                        : {dist: rs.dist + 1, brk: el[jdx] >= curr},
                    {dist: 0, brk: false}
                ).dist);
                const scscB = [arrB.slice(0, jdx).reverse(), arrB.slice(jdx + 1)].map(arr => arr.reduce(
                    (rs, el) => rs.brk
                        ? rs
                        : {dist: rs.dist + 1, brk: el >= curr},
                    {dist: 0, brk: false}
                ).dist);
                return Math.max(res, scscA[0] * scscA[1] * scscB[0] * scscB[1]);
            },
        0)), 0);
}
