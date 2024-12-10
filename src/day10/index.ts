import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput.split('\n').map(line => line.split('').map(Number))

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, line, y) => {
		return count + line.reduce<number>((countLine, height, x) => {
			if (height !== 0) return countLine

			const visited = findPeaks(input, x, y, 0)
			return countLine + new Set(visited).size
		}, 0)
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, line, y) => {
		return count + line.reduce<number>((countLine, height, x) => {
			if (height !== 0) return countLine

			return countLine + findRoutes(input, x, y, 0)
		}, 0)
	}, 0)
}

function findPeaks(map: number[][], x: number, y: number, height: number): string[] {
	if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return []
	if (map[y][x] !== height) return []
	if (height === 9) return [`${x},${y}`]

	const nextHeight = height + 1
	return [
		...findPeaks(map, x - 1, y, nextHeight),
		...findPeaks(map, x + 1, y, nextHeight),
		...findPeaks(map, x, y - 1, nextHeight),
		...findPeaks(map, x, y + 1, nextHeight),
	]
}

function findRoutes(map: number[][], x: number, y: number, height: number): number {
	if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return 0
	if (map[y][x] !== height) return 0
	if (height === 9) return 1

	const nextHeight = height + 1
	return (
		findRoutes(map, x - 1, y, nextHeight) +
		findRoutes(map, x + 1, y, nextHeight) +
		findRoutes(map, x, y - 1, nextHeight) +
		findRoutes(map, x, y + 1, nextHeight)
	)
}

run({
	part1: {
		tests: [
			{
				input: `
					89010123
					78121874
					87430965
					96549874
					45678903
					32019012
					01329801
					10456732`,
				expected: 36,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					89010123
					78121874
					87430965
					96549874
					45678903
					32019012
					01329801
					10456732`,
				expected: 81,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
