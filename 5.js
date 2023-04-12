function parseMove(str) {
    const [n, from, to] = str.match(/\d+/g).map(Number);
    return {n, from, to};
}
function doMove(stacks, move, saveOrder = false) {
    const mv = parseMove(move);

    const moved = stacks[mv.from - 1].splice(-mv.n, mv.n);
    stacks[mv.to - 1].push(...(saveOrder ? moved : moved.reverse()));

    return stacks;
}

function getUpperCrates(stacks, moveList, crateMover9001 = false) {
    return moveList
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => doMove(res, curr, crateMover9001), JSON.parse(JSON.stringify(stacks)))
        .reduce((res, curr) => res + curr.at(-1), '');
}
