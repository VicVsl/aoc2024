import run from 'aocrunner'

enum Direction {
	UP = '^',
	DOWN = 'v',
	LEFT = '<',
	RIGHT = '>',
}

type Position = { cost: number, direction?: Direction, trail?: Set<string> }

const parseInput = (rawInput: string) => rawInput.split('\n').map(line =>
	line.split('').map(char => {
		switch (char) {
			case '#':
				return { cost: -1 }
			case '.':
				return { cost: Number.MAX_SAFE_INTEGER }
			case 'S':
				return { cost: 0, direction: Direction.RIGHT, trail: new Set<string>() }
			case 'E':
				return { cost: -2 }
			default:
				throw new Error(`Unknown character: ${char}`)
		}
	})
)

function isOpposite(dir1: Direction, dir2: Direction): boolean {
	switch (dir1) {
		case Direction.UP:
			return dir2 === Direction.DOWN
		case Direction.DOWN:
			return dir2 === Direction.UP
		case Direction.LEFT:
			return dir2 === Direction.RIGHT
		case Direction.RIGHT:
			return dir2 === Direction.LEFT
	}
}

function findStart(map: Position[][]): [number, number] {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x].cost === 0) {
				map[y][x].trail!.add(`${x},${y}`)
				return [x, y]
			}
		}
	}
	throw new Error('Start not found')
}

function checkNeighbor(
	input: Position[][],
	position: Position,
	x: number,
	y: number,
	direction: Direction,
	queue: [number, number][],
	endValue: { value: number },
	endTrail?: Set<string>
) {
	if (isOpposite(position.direction!, direction)) return
	const neighbor = input[y][x]
	const newCost = position.cost + 1 + (position.direction !== direction ? 1000 : 0)
	if (neighbor.cost === -1) return
	// console.log(x, y, newCost, neighbor.cost)
	if (neighbor.cost === -2) {
		const diff = endValue.value - newCost
		if (diff < 0) return
		endValue.value = newCost

		if (!endTrail) return
		if (diff != 0) endTrail.clear()
		position.trail!.forEach(trail => endTrail.add(trail))
		endTrail.add(`${x},${y}`)
		return
	}
	if (endTrail && neighbor.cost === newCost) {
		// console.log('collision', x, y)
		position.trail!.forEach(trail => neighbor.trail!.add(trail))
		neighbor.trail!.add(`${x},${y}`)
		// console.log('trail', neighbor.trail)
		return
	}
	if (endTrail && neighbor.cost - newCost === 1000) {
		// console.log('collision special', x, y)
		position.trail!.forEach(trail => neighbor.trail!.add(trail))
		neighbor.trail!.add(`${x},${y}`)
		// console.log('trail', neighbor.trail)
		neighbor.cost = newCost
		neighbor.direction = direction
		queue.push([x, y])
		return
	}
	if (endTrail && newCost - neighbor.cost === 1000) {
		// console.log('collision special 2', x, y)
		position.trail!.forEach(trail => neighbor.trail!.add(trail))
		neighbor.trail!.add(`${x},${y}`)
		// console.log('trail', neighbor.trail)
		return
	}
	if (neighbor.cost > newCost) {
		neighbor.cost = newCost
		neighbor.direction = direction
		neighbor.trail = new Set(position.trail)
		neighbor.trail!.add(`${x},${y}`)
		queue.push([x, y])
		// console.log('push', x, y, direction, newCost)
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const start = findStart(input)
	const endValue: { value: number } = { value: Number.MAX_SAFE_INTEGER }

	const queue = [start]
	for (let i = 0; i < queue.length; i++) {
		const [x, y] = queue[i]
		const position = input[y][x]

		checkNeighbor(input, position, x - 1, y, Direction.LEFT, queue, endValue)
		checkNeighbor(input, position, x + 1, y, Direction.RIGHT, queue, endValue)
		checkNeighbor(input, position, x, y - 1, Direction.UP, queue, endValue)
		checkNeighbor(input, position, x, y + 1, Direction.DOWN, queue, endValue)
	}

	return endValue.value
}

const part2 = (rawInput: string) => {
	const input: Position[][] = parseInput(rawInput)

	const start = findStart(input)
	const endValue: { value: number } = { value: Number.MAX_SAFE_INTEGER }
	const endTrail = new Set<string>()

	const queue = [start]
	for (let i = 0; i < queue.length; i++) {
		const [x, y] = queue[i]
		const position = input[y][x]
		// console.log(x, y, position.cost, position.direction, position.trail?.size)

		checkNeighbor(input, position, x - 1, y, Direction.LEFT, queue, endValue, endTrail)
		checkNeighbor(input, position, x + 1, y, Direction.RIGHT, queue, endValue, endTrail)
		checkNeighbor(input, position, x, y - 1, Direction.UP, queue, endValue, endTrail)
		checkNeighbor(input, position, x, y + 1, Direction.DOWN, queue, endValue, endTrail)
	}

	// input.forEach(row => console.log(row.map(cell => (cell.trail?.size ?? '00').toString()).join(' ')))
	console.log(endTrail)
	return endTrail.size
}

run({
	part1: {
		tests: [
			{
				input: `
					###############
					#.......#....E#
					#.#.###.#.###.#
					#.....#.#...#.#
					#.###.#####.#.#
					#.#.#.......#.#
					#.#.#####.###.#
					#...........#.#
					###.#.#####.#.#
					#...#.....#.#.#
					#.#.#.###.#.#.#
					#.....#...#.#.#
					#.###.#.#.#.#.#
					#S..#.....#...#
					###############`,
				expected: 7036,
			},
			{
				input: `
					#################
					#...#...#...#..E#
					#.#.#.#.#.#.#.#.#
					#.#.#.#...#...#.#
					#.#.#.#.###.#.#.#
					#...#.#.#.....#.#
					#.#.#.#.#.#####.#
					#.#...#.#.#.....#
					#.#.#####.#.###.#
					#.#.#.......#...#
					#.#.###.#####.###
					#.#.#...#.....#.#
					#.#.#.#####.###.#
					#.#.#.........#.#
					#.#.#.#########.#
					#S#.............#
					#################`,
				expected: 11048,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					###############
					#.......#....E#
					#.#.###.#.###.#
					#.....#.#...#.#
					#.###.#####.#.#
					#.#.#.......#.#
					#.#.#####.###.#
					#...........#.#
					###.#.#####.#.#
					#...#.....#.#.#
					#.#.#.###.#.#.#
					#.....#...#.#.#
					#.###.#.#.#.#.#
					#S..#.....#...#
					###############`,
				expected: 45,
			},
			{
				input: `
					#################
					#...#...#...#..E#
					#.#.#.#.#.#.#.#.#
					#.#.#.#...#...#.#
					#.#.#.#.###.#.#.#
					#...#.#.#.....#.#
					#.#.#.#.#.#####.#
					#.#...#.#.#.....#
					#.#.#####.#.###.#
					#.#.#.......#...#
					#.#.###.#####.###
					#.#.#...#.....#.#
					#.#.#.#####.###.#
					#.#.#.........#.#
					#.#.#.#########.#
					#S#.............#
					#################`,
				expected: 64,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
