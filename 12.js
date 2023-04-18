const clearHeight = l => l === 'S' ? 'a' : l === 'E' ? 'z' : l;
const objApplyAll = (obj, keys) => keys.reduce((res, key) => res ? res[key] : undefined, obj);

function genGridGraph(grid, start, end) {
    const nodes = grid
        .split('\n')
        .filter(Boolean)
        .map(row => row
            .split('')
            .filter(Boolean)
        );
    const nodeIds = nodes.map(
        (row, i) => row.map(
            (cell, j) => ({[start]: 's', [end]: 'e'}[cell]) || i * row.length + j
        )
    );

    const graph = {};

    nodes.forEach((row, i) => row.forEach((cell, j) => {
        const curr = {$: cell};
        graph[nodeIds[i][j]] = curr;

        const links = [
            [i + 1, j],
            [i - 1, j],
            [i, j + 1],
            [i, j - 1]
        ].filter(el => objApplyAll(nodes, el));

        links.forEach(link => curr[objApplyAll(nodeIds, link)] = objApplyAll(nodes, link));
    }));

    return graph;
}
function breadthFirstSearch(graph, start) {
    const queue = [start];
    const dist = {};

    dist[start] = 0;
    while (queue.length) {
        const curr = queue.shift();
        for (const link in graph[curr]) {
            if (link !== '$' && !(link in dist)) {
                dist[link] = dist[curr] + 1;
                queue.push(link);
            }
        }
    }

    return dist;
}
function isReachable(from, to) {
    const heights = 'abcdefghijklmnopqrstuvwxyz';

    return heights.indexOf(clearHeight(from)) + 1 >= heights.indexOf(clearHeight(to));
}
function isReachableReverse(from, to) {
    return isReachable(to, from);
}

function shortestClimbPath(grid, fromStart = true) {
    const graph = genGridGraph(grid, 'S', 'E');

    Object.values(graph).forEach(node => Object.entries(node).forEach(link => {
        if (!isReachableReverse(node.$, link[1])) delete node[link[0]];
    }));

    const lengths = breadthFirstSearch(graph, 'e');
    return fromStart ? lengths['s'] : Object.entries(lengths).reduce(
        (res, [link, len]) => clearHeight(graph[link].$) === 'a' ? Math.min(res, len) : res,
        Infinity
    );
}
