import run from 'aocrunner'
import { count } from 'console'

enum Direction {
	UP = '^',
	DOWN = 'v',
	LEFT = '<',
	RIGHT = '>',
}

type Position = {
	guard: Direction | false
	visited: boolean
	obstacle: boolean
}

type Guard = {
	i: number
	j: number
	direction: Direction
}

type Obstacle = {
	i: number
	j: number
	up: Obstacle | undefined
	left: Obstacle | undefined
	down: Obstacle | undefined
	right: Obstacle | undefined
}

function parsePosition(char: string): Position {
	switch (char) {
		case '#':
			return { guard: false, visited: false, obstacle: true }
		case '^':
			return { guard: Direction.UP, visited: false, obstacle: false }
		case 'v':
			return { guard: Direction.DOWN, visited: false, obstacle: false }
		case '<':
			return { guard: Direction.LEFT, visited: false, obstacle: false }
		case '>':
			return { guard: Direction.RIGHT, visited: false, obstacle: false }
		case '.':
			return { guard: false, visited: false, obstacle: false }
		default:
			throw new Error(`Invalid char ${char}`)
	}
}

const parseInput = (rawInput: string) => rawInput.split('\n')
	.map(line => line.split('')
		.map(char => parsePosition(char)))

function findGuard(positions: Position[][]): Guard {
	for (let i = 0; i < positions.length; i++) {
		for (let j = 0; j < positions[i].length; j++) {
			const guard = positions[i][j].guard
			if (guard) return { i, j, direction: guard }
		}
	}
	throw new Error('Guard not found');
}

function rotateGuard(direction: Direction): Direction {
	switch (direction) {
		case Direction.UP:
			return Direction.RIGHT
		case Direction.RIGHT:
			return Direction.DOWN
		case Direction.DOWN:
			return Direction.LEFT
		case Direction.LEFT:
			return Direction.UP
	}
}


function getNext(positions: Position[][], guard: Guard): [Position | undefined, number, number] {
	const { i, j, direction } = guard
	try {
		switch (direction) {
			case Direction.UP:
				return [positions[i - 1][j], i - 1, j]
			case Direction.DOWN:
				return [positions[i + 1][j], i + 1, j]
			case Direction.LEFT:
				return [positions[i][j - 1], i, j - 1]
			case Direction.RIGHT:
				return [positions[i][j + 1], i, j + 1]
		}
	} catch (e) {
		return [undefined, -1, -1]
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let guard = findGuard(input)

	let visited = 0
	while (true) {
		const current = input[guard.i][guard.j]
		if (!current.visited) {
			visited++
			current.visited = true
		}

		const [next, i, j] = getNext(input, guard)
		if (!next) break
		if (next.obstacle) guard.direction = rotateGuard(guard.direction)
		else guard = { i, j, direction: guard.direction }
	}
	return visited
}

// ------------ These were for trying to solve without brute force, might retry later ------------
// function findObstacles(positions: Position[][]): Obstacle[] {
// 	const obstacles: Obstacle[] = []
// 	for (let i = 0; i < positions.length; i++) {
// 		for (let j = 0; j < positions[i].length; j++) {
// 			if (positions[i][j].obstacle) {
// 				obstacles.push({
// 					i, j, up: undefined, left: undefined, down: undefined, right: undefined
// 				})
// 			}
// 		}
// 	}
// 	return obstacles
// }

// function scanForObstacle(obstacles: Obstacle[], obstacle: Obstacle): Obstacle {
// 	obstacle.down = obstacles.filter(o => o.i === obstacle.i + 1 && o.j > obstacle.j)
// 		.sort((a, b) => a.j - b.j).at(0)
// 	obstacle.left = obstacles.filter(o => o.j === obstacle.j - 1 && o.i > obstacle.i)
// 		.sort((a, b) => a.i - b.i).at(0)
// 	obstacle.up = obstacles.filter(o => o.i === obstacle.i - 1 && o.j < obstacle.j)
// 		.sort((a, b) => b.j - a.j).at(0)
// 	obstacle.right = obstacles.filter(o => o.j === obstacle.j + 1 && o.i < obstacle.i)
// 		.sort((a, b) => b.i - a.i).at(0)
// 	return obstacle
// }

function isOutOfBounds(positions: Position[][], i: number, j: number): boolean {
	return i < 0 || i >= positions[j].length || j < 0 || j >= positions.length
}

function isLoop(positions: Position[][], guard: Guard) {
	let iters = 0
	while (!isOutOfBounds(positions, guard.i, guard.j)) {
		if (++iters > 10000) return true

		const [next, i, j] = getNext(positions, guard)
		if (!next) return false
		if (next.obstacle) guard.direction = rotateGuard(guard.direction)
		else guard = { i, j, direction: guard.direction }
	}
	return false
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const guard = findGuard(input)
	let answer = 0
	for (let i = 0; i < input.length - 1; i++) {

	}
	return input.reduce<number>((sum, line, i) => {
		return sum + line.reduce<number>((count, pos, j) => {
			if (pos.guard || pos.obstacle) return count

			const inputCopy = input.map((l) => l.map((item) => ({ ...item })))
			inputCopy[i][j].obstacle = true

			if (isLoop(inputCopy, { ...guard })) count++
			return count
		}, 0)
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
				expected: 41,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`,
				expected: 6,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
