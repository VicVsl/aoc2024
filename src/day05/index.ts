import run from 'aocrunner'

const parseInput = (rawInput: string) => {
	const lists = rawInput.split('\n\n').map(list => list.split('\n'))
	const orders = lists[0].map(entry => entry.split('|').map(Number))
	const updates = lists[1].map(update => update.split(',').map(Number))
	return { orders, updates }
}

function createOrderMap(orders: number[][]) {
	return orders.reduce<Map<number, number[]>>((map, [a, b]) => {
		if (!map.has(a)) map.set(a, [])
		if (!map.get(a)!.find(x => x === b)) map.get(a)!.push(b)
		return map
	}, new Map())
}

const part1 = (rawInput: string) => {
	const { orders, updates } = parseInput(rawInput)

	const orderMap = createOrderMap(orders)

	return updates.reduce<number>((count, update) => {
		const valid = update.every((value, index) => {
			const prev = update.slice(0, index)
			const after = orderMap.get(value)
			if (prev.length === 0 || !after || after.length === 0) return true
			return !prev.some(val => after.includes(val))
		})
		return valid ? count + update[Math.floor(update.length / 2)] : count
	}, 0)
}

const part2 = (rawInput: string) => {
	const { orders, updates } = parseInput(rawInput)

	const orderMap = createOrderMap(orders)

	return updates.reduce<number>((count, update) => {
		let valid = true

		for (let index = 0; index < update.length; index++) {
			const prev = update.slice(0, index)
			const after = orderMap.get(update[index])
			if (prev.length === 0 || !after || after.length === 0) continue

			const problem = prev.find(val => after.includes(val))
			if (!problem) continue
			const problemIndex = prev.indexOf(problem)

			const temp = update[index]
			update[index] = update[problemIndex]
			update[problemIndex] = temp

			valid = false
			index = -1
		}

		return !valid ? count + update[Math.floor(update.length / 2)] : count
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
				expected: 143,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`,
				expected: 123,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
