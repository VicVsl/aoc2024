import run from 'aocrunner'
import { count } from 'console'

enum Direction {
	UP = '^',
	DOWN = 'v',
	LEFT = '<',
	RIGHT = '>',
}

type Position = {
	guard: Direction | null
	visited: boolean
	obstacle: boolean
	visitDirections: {
		up: boolean
		down: boolean
		left: boolean
		right: boolean
	}
}

type Guard = {
	x: number
	y: number
	direction: Direction
}

function parsePosition(char: string): Position {
	const base = {
		guard: null,
		obstacle: false,
		visited: false,
		visitDirections: { up: false, down: false, left: false, right: false },
	}
	switch (char) {
		case '#':
			return { ...base, obstacle: true }
		case '^':
			return { ...base, guard: Direction.UP }
		case 'v':
			return { ...base, guard: Direction.DOWN }
		case '<':
			return { ...base, guard: Direction.LEFT }
		case '>':
			return { ...base, guard: Direction.RIGHT }
		case '.':
			return { ...base }
		default:
			throw new Error(`Invalid char ${char}`)
	}
}

const parseInput = (rawInput: string) =>
	rawInput.split('\n').map(line => line.split('').map(char => parsePosition(char)))

function copyInput(input: Position[][]): Position[][] {
	return input.map(line =>
		line.map(position => ({
			guard: position.guard,
			visited: position.visited,
			obstacle: position.obstacle,
			visitDirections: {
				up: position.visitDirections.up,
				down: position.visitDirections.down,
				left: position.visitDirections.left,
				right: position.visitDirections.right,
			},
		}))
	)
}

function findGuard(positions: Position[][]): Guard {
	for (let i = 0; i < positions.length; i++) {
		for (let j = 0; j < positions[i].length; j++) {
			const guard = positions[i][j].guard
			if (guard) return { x: j, y: i, direction: guard }
		}
	}
	throw new Error('Guard not found')
}

function copyGuard(guard: Guard): Guard {
	return { x: guard.x, y: guard.y, direction: guard.direction }
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

function getNext(
	positions: Position[][],
	guard: Guard
):
	| {
			position: Position
			x: number
			y: number
	  }
	| undefined {
	const { x, y, direction } = guard

	const { newX, newY } = (() => {
		switch (direction) {
			case Direction.UP:
				return { newX: x, newY: y - 1 }
			case Direction.DOWN:
				return { newX: x, newY: y + 1 }
			case Direction.LEFT:
				return { newX: x - 1, newY: y }
			case Direction.RIGHT:
				return { newX: x + 1, newY: y }
		}
	})()

	try {
		const position = positions[newY][newX]
		if (!position) return undefined
		return { position, x: newX, y: newY }
	} catch (e) {
		return undefined
	}
}

function checkVisitedDirections(direction: Direction, position: Position): boolean {
	let repeat
	switch (direction) {
		case Direction.UP:
			repeat = position.visitDirections!!.up
			position.visitDirections!!.up = true
			break
		case Direction.DOWN:
			repeat = position.visitDirections!!.down
			position.visitDirections!!.down = true
			break
		case Direction.LEFT:
			repeat = position.visitDirections!!.left
			position.visitDirections!!.left = true
			break
		case Direction.RIGHT:
			repeat = position.visitDirections!!.right
			position.visitDirections!!.right = true
			break
	}
	return repeat
}

function isLoop(positions: Position[][], guard: Guard) {
	while (true) {
		const current = positions[guard.y][guard.x]
		if (!current.visited) current.visited = true
		else if (checkVisitedDirections(guard.direction, current)) return true

		const next = getNext(positions, guard)
		if (!next) break
		if (next.position.obstacle) guard.direction = rotateGuard(guard.direction)
		else {
			guard.x = next.x
			guard.y = next.y
		}
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let guard = findGuard(input)
	let visited = 0
	while (true) {
		const current = input[guard.y][guard.x]
		if (!current.visited) {
			visited++
			current.visited = true
		}

		const next = getNext(input, guard)
		if (!next) break
		if (next.position.obstacle) guard.direction = rotateGuard(guard.direction)
		else {
			guard.x = next.x
			guard.y = next.y
		}
	}
	return visited
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const start = findGuard(input)

	let guard = copyGuard(start)
	const visited: { x: number; y: number }[] = []
	const inputCopy = copyInput(input)
	while (true) {
		const current = inputCopy[guard.y][guard.x]
		if (!current.visited) {
			visited.push({ x: guard.x, y: guard.y })
			current.visited = true
		}

		const next = getNext(inputCopy, guard)
		if (!next) break
		if (next.position.obstacle) guard.direction = rotateGuard(guard.direction)
		else {
			guard.x = next.x
			guard.y = next.y
		}
	}

	return visited.reduce<number>((count, cords) => {
		const { x, y } = cords
		const { guard: hasGuard, obstacle } = input[y][x]
		if (hasGuard || obstacle) return count

		const inputCopy = copyInput(input)
		inputCopy[y][x].obstacle = true

		if (isLoop(inputCopy, copyGuard(start))) count++
		return count
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
