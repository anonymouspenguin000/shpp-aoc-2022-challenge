Array.prototype.split = function (sep) {
	return this.reduce((res, el) => {
		if (el === sep) res.push([]);
		else res.at(-1).push(el);
		return res;
	}, [[]]);
}

function getAllElves(list) {
	return list
		.replace(/\n+$/, '') // Just in case
		.split('\n')
		.split('');
}

function findTop1Elf(list) {
	return getAllElves(list).reduce((res, curr, idx) => {
		const currSum = curr.reduce((r, c) => r + + c, 0);
		return currSum >= res.cal ? {idx, cal: currSum} : res;
	}, {idx: -1, cal: 0});
}

function findTop3Elves(list) {
	return getAllElves(list).reduce((res, curr, idx) => {
		const currSum = curr.reduce((r, c) => r + + c, 0);
		const insPos = res.top.findIndex(el => currSum >= el.cal);
		const currTop = res.top.reduce((r, c, i, a) =>
			[...r, i === insPos ? {idx, cal: currSum} : (insPos > -1 && i > insPos ? a[i - 1] : c)],
			[]
		);
		return {
			top: currTop,
			total: currTop.reduce((r, c) => r + c.cal, 0)
		};
	}, {top: [{idx: -1, cal: 0}, {idx: -1, cal: 0}, {idx: -1, cal: 0}], total: 0});
}
