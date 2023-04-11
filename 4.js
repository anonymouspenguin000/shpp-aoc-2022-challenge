function getRange(str) {
    const [from, to] = str.split('-').map(Number);
    return {from, to};
}
const doRangesCover = (r1, r2) => (r1.from <= r2.from && r1.to >= r2.to) || (r1.from >= r2.from && r1.to <= r2.to);
const doRangesOverlap = (r1, r2) => r1.to >= r2.from && r1.from <= r2.to;

function getCoverCount(list) {
    return list
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => res + + doRangesCover(...curr.split(',').map(getRange)), 0);
}
function getOverlapCount(list) {
    return list
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => res + + doRangesOverlap(...curr.split(',').map(getRange)), 0);
}
