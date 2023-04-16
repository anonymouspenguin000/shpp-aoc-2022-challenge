const CRTWidth = 40;

function getXRegCycles(program) {
    return program
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => [...res, ...(wt => wt[0] === 'addx' ? [0, +wt[1]] : [0])(curr.split(' '))], []);
}

function calcF20ev40to220SignalStrength(program) { // F20ev40to220 = From 20th [then] Every 40th To 220th Cycle
    return getXRegCycles(program).reduce((res, curr, i) => ({
        x: res.x + curr,
        total: res.total + (cy => (cy <= 220 && (cy - 20) % 40 === 0 ? res.x : 0) * cy)(i + 1)
    }), {x: 1, total: 0}).total;
}
function renderCRT(program) {
    return getXRegCycles(program).reduce((res, curr, i) => ({
        x: res.x + curr,
        pic:
            res.pic +
            ([res.x - 1, res.x, res.x + 1].includes(i % CRTWidth) ? '#' : '.') +
            ((i + 1) % CRTWidth === 0 ? '\n': '')
    }), {x: 1, pic: ''}).pic;
}
