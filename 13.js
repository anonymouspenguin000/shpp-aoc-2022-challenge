const isNum = n => typeof n === 'number';
const isArray = arr => arr instanceof Array;
function compareItems(a, b) {
    if (isNum(a) && isArray(b)) return compareItems([a], b);
    if (isArray(a) && isNum(b)) return compareItems(a, [b]);

    if (isNum(a) && isNum(b)) return a === b ? 0 : a > b ? 1 : -1;
    if (isArray(a) && isArray(b)) return (b.length > a.length ? b : a).reduce((res, _el, idx) =>
            res === 0
                ? b[idx] === undefined
                    ? 1
                    : a[idx] === undefined
                        ? -1
                        : compareItems(a[idx], b[idx])
                : res,
        0
    );
}

function correctPacketsSum(packets) {
    return packets
        .split('\n\n')
        .filter(Boolean)
        .map(pair => pair.split('\n').filter(Boolean).map((el, _i, arr) => JSON.parse(el)))
        .reduce((res, curr, idx) => res + (idx + 1) * (compareItems(...curr) <= 0), 0);
}
function getDecoderKey(packets) {
    return [[[2]], [[6]]]
        .concat(packets
            .split('\n')
            .filter(Boolean)
            .map(el => JSON.parse(el))
        )
        .sort((a, b) => compareItems(a, b))
        .reduce((res, curr, idx) =>
                ['[[2]]', '[[6]]'].includes(JSON.stringify(curr))
                    ? res * (idx + 1)
                    : res,
            1
        );
}
