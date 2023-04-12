function findMarkerPos(signal, indicatorLen) {
    return [...signal.trim()].findIndex(
        (el, idx, arr) =>
            idx >= indicatorLen
            && [...new Set([...arr.slice(idx - indicatorLen, idx)])].length === indicatorLen
    );
}
