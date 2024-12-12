import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split(' ').map(Number)

function getNextStones(value: number) {
	if (value === 0) return [1]

	const valString = value.toString()
	const valDigits = valString.length
	if (valDigits % 2 === 0) return [
		Number(valString.slice(0, valDigits / 2)),
		Number(valString.slice(valDigits / 2, valDigits))
	]

	return [value * 2024]
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, initial) => {
		let list = [initial]
		for (let i = 0; i < 25; i++) {
			list = list.reduce<number[]>((acc, value) => {
				acc.push(...getNextStones(value))
				return acc
			}, [])
		}

		return count + list.length
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let stones = new Map<number, number>()
	input.forEach(value => stones.set(value, 1))

	for (let i = 0; i < 75; i++) {
		stones = Array.from(stones.entries()).reduce((map, [value, amount]) => {
			getNextStones(value).forEach(stone => map.set(stone, (map.get(stone) ?? 0) + amount))
			return map
		}, new Map<number, number>())
	}

	return Array.from(stones.values()).reduce((count, value) => count + value, 0)
}

run({
	part1: {
		tests: [
			{
				input: `125 17`,
				expected: 55312,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `125 17`,
				expected: 65601038650482,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
