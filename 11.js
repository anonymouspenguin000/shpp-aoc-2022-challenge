function calcMonkeyBusiness(rounds, initial, damageRelief = true) {
    /** Initial[]'s element syntax:
     * Object {
     *      items: number[],                                     #Starting items the monkey is currently holding
     *      operation: (old: number) => new: number,             #Function the monkey uses to calculate the worry level
     *      cond: [divisor: number, if0: number, else: number]   #Rules the monkey uses to decide the throw direction
     * }
     * */
    const coMul = initial.reduce((res, curr) => res * curr.cond[0], 1);

    const monkeyItems = initial.map(monkey => [...monkey.items]);
    const monkeyInspectCount = new Array(initial.length).fill(0);

    for (let i = 0; i < rounds; i++) {
        monkeyItems.forEach((monkey, idx) => {
            monkeyItems[idx] = [];
            monkeyInspectCount[idx] += monkey.length;

            const currOperFn = initial[idx].operation;
            const currCond = initial[idx].cond;
            monkey.forEach(oldItem => {
                const operRes = currOperFn(oldItem);
                const item = damageRelief ? Math.floor(operRes / 3) : operRes % coMul;
                const currTest = item % currCond[0] === 0 ? currCond[1] : currCond[2];
                monkeyItems[currTest].push(item);
            });
        });
    }

    return monkeyInspectCount.sort((a, b) => a - b).slice(-2).reduce((r, c) => r * c, 1);
}
