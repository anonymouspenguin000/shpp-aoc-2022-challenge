const config = {
    scores: {
        r: 1,
        p: 2,
        s: 3,
        rm: 3 // Round Multiplier
    },
    beats: {
        r: 's',
        p: 'r',
        s: 'p'
    },
    alias: {
        fig: {
            a: 'r',
            b: 'p',
            c: 's',
            x: 'r',
            y: 'p',
            z: 's'
        },
        res: {
            x: 0,
            y: 1,
            z: 2
        }
    }
};

function getRoundRes(p1, p2) {
    if (p1 === p2) return 1;
    if (config.beats[p1] === p2) return 2;
    return 0;
}
function getRoundM1(p2, res) {
    if (res === 2) return Object.entries(config.beats).find(([, v]) => v === p2)[0];
    if (res === 0) return config.beats[p2];
    return p2;
}

function calcScoreAlgo1(guide) {
    return guide.split('\n').reduce((res, curr) => {
        if (curr.trim() === '') return res;
        const [op, me] = curr.split(' ').map(el => config.alias.fig[el.toLowerCase()]);
        return res + getRoundRes(me, op) * config.scores.rm + config.scores[me];
    }, 0);
}
function calcScoreAlgo2(guide) {
    return guide.split('\n').reduce((res, curr) => {
        if (curr.trim() === '') return res;
        const [op, rs] = curr.split(' ').map((el, i) => config.alias[['fig', 'res'][i]][el.toLowerCase()]);
        return res + rs * config.scores.rm + config.scores[getRoundM1(op, rs)];
    }, 0);
}
