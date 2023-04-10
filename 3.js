const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function findCommon(...lists) {
    if (lists.length <= 1) return undefined;
    // I use the spread operator below because I want this function to work with different iterables
    // I use Set for performance. It is a "Hash Map", which provides read complexity O(1)
    return [...lists[0]].find(ela => lists.slice(1).every(el => new Set([...el]).has(ela)));
}

function calcTotalPriority(list) {
    return list
        .split('\n')
        .filter(Boolean) // Just in case
        .reduce((res, curr) => res + priorities.indexOf(
            findCommon(curr.slice(0, curr.length / 2), curr.slice(curr.length / 2))
        ) + 1, 0);
}
function calcTotalBadgePriority(list) {
    return list
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => res.at(-1).length === 3
            ? [...res, [curr]]
            : [...res.slice(0, -1), [...res.at(-1), curr]], [[]]
        )
        .reduce((res, curr) => res + priorities.indexOf(findCommon(...curr)) + 1, 0);
}
