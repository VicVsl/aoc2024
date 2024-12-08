import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput.split('\n').reduce<[number[], number[]]>(
		([left, right], line) => {
			const [first, second] = line.split('   ').map(Number)
			left.push(first)
			right.push(second)
			return [left, right]
		},
		[[], []]
	)

const part1 = (rawInput: string) => {
	const [left, right] = parseInput(rawInput)

	left.sort((a, b) => a - b)
	right.sort((a, b) => a - b)

	return left.reduce((sum, _, i) => sum + Math.abs(left[i] - right[i]), 0)
}

const part2 = (rawInput: string) => {
	const [left, right] = parseInput(rawInput)

	const rightMap = right.reduce<Map<number, number>>((map, value) => {
		if (!map.has(value)) {
			map.set(value, 0)
		}
		map.set(value, map.get(value)! + 1)
		return map
	}, new Map())

	return left.reduce((sum, value) => sum + value * (rightMap.get(value) ?? 0), 0)
}

run({
	part1: {
		tests: [
			{
				input: `
					3   4
					4   3
					2   5
					1   3
					3   9
					3   3`,
				expected: 11,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					3   4
					4   3
					2   5
					1   3
					3   9
					3   3`,
				expected: 31,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
