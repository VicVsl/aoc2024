import run from 'aocrunner'

enum Direction {
	UP = '^',
	DOWN = 'v',
	LEFT = '<',
	RIGHT = '>',
}

enum State {
	ROBOT = '@',
	WALL = '#',
	BOX = 'O',
	EMPTY = '.',
	BOX_LEFT = '[',
	BOX_RIGHT = ']',
}

const parseInput = (rawInput: string) => rawInput.split('\n\n')
	.map(text => text.split('\n')
		.map(line => line.split('')
			.map(char => parseChar(char))))

const convertPart2Map = (map: State[][]) => map.map(row => row.flatMap(state => {
	switch (state) {
		case State.BOX:
			return [State.BOX_LEFT, State.BOX_RIGHT]
		case State.EMPTY:
			return [State.EMPTY, State.EMPTY]
		case State.WALL:
			return [State.WALL, State.WALL]
		case State.ROBOT:
			return [State.ROBOT, State.EMPTY]
	}
}))

function parseChar(char: string) {
	switch (char) {
		case '#':
			return State.WALL
		case 'O':
			return State.BOX
		case '[':
			return State.BOX_LEFT
		case ']':
			return State.BOX_RIGHT
		case '@':
			return State.ROBOT
		case '.':
			return State.EMPTY
		case '^':
			return Direction.UP
		case 'v':
			return Direction.DOWN
		case '<':
			return Direction.LEFT
		case '>':
			return Direction.RIGHT
		default:
			throw new Error(`Invalid character: ${char}`)
	}
}

function getTwinDirection(state: State): Direction {
	return state === State.BOX_LEFT ? Direction.RIGHT : Direction.LEFT
}

function findRobot(map: State[][]): [number, number] {
	for (let y = 0; y < map.length; y++) {
		for (let x = 0; x < map[y].length; x++) {
			if (map[y][x] === State.ROBOT) {
				return [x, y]
			}
		}
	}
	throw new Error('Robot not found')
}

function getNext(cords: [number, number], direction: Direction): [number, number] {
	const [x, y] = cords
	switch (direction) {
		case Direction.UP:
			return [x, y - 1]
		case Direction.DOWN:
			return [x, y + 1]
		case Direction.LEFT:
			return [x - 1, y]
		case Direction.RIGHT:
			return [x + 1, y]
	}
}

function checkMovable(map: State[][], cords: [number, number], direction: Direction): boolean {
	const next = getNext(cords, direction)
	const [nextX, nextY] = next

	switch (map[nextY][nextX]) {
		case State.WALL:
			return false
		case State.EMPTY:
			return true
		case State.BOX_LEFT:
		case State.BOX_RIGHT:
			const twin = getNext(next, getTwinDirection(map[nextY][nextX]))
			return checkMovable(map, next, direction) && checkMovable(map, twin, direction)
		default:
			throw new Error('Invalid move')
	}
}

function moveObject(
	map: State[][],
	cords: [number, number],
	direction: Direction
): [number, number] | false {
	const next = getNext(cords, direction)
	const [x, y] = cords
	const [nextX, nextY] = next

	switch (map[nextY][nextX]) {
		case State.WALL:
			return false
		case State.BOX_LEFT:
		case State.BOX_RIGHT:
			if (direction === Direction.UP || direction === Direction.DOWN) {
				const twin = getNext(next, getTwinDirection(map[nextY][nextX]))
				if (!checkMovable(map, cords, direction) || !checkMovable(map, twin, direction))
					return false

				moveObject(map, twin, direction)
			}
		case State.BOX:
			if (!moveObject(map, next, direction)) return false
		case State.EMPTY:
			map[nextY][nextX] = map[y][x]
			map[y][x] = State.EMPTY
			return next
		default:
			throw new Error('Invalid move')
	}
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const map = input[0] as State[][]
	const moves = input[1].flat() as Direction[]

	let robot = findRobot(map)
	moves.forEach(move => robot = moveObject(map, robot, move) || robot)

	return map.reduce<number>((count, row, y) => {
		return row.reduce<number>((rowCount, state, x) => {
			return state === State.BOX ? rowCount + y * 100 + x : rowCount
		}, count)
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const map = convertPart2Map(input[0] as State[][]) as State[][]
	const moves = input[1].flat() as Direction[]

	let robot = findRobot(map)
	moves.forEach(move => robot = moveObject(map, robot, move) || robot)

	return map.reduce<number>((count, row, y) => {
		return row.reduce<number>((rowCount, state, x) => {
			return state === State.BOX_LEFT ? rowCount + y * 100 + x : rowCount
		}, count)
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `
					########
					#..O.O.#
					##@.O..#
					#...O..#
					#.#.O..#
					#...O..#
					#......#
					########

					<^^>>>vv<v>>v<<`,
				expected: 2028,
			},
			{
				input: `
					##########
					#..O..O.O#
					#......O.#
					#.OO..O.O#
					#..O@..O.#
					#O#..O...#
					#O..O..O.#
					#.OO.O.OO#
					#....O...#
					##########

					<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
					vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
					><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
					<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
					^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
					^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
					>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
					<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
					^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
					v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
				expected: 10092,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					#######
					#...#.#
					#.....#
					#..OO@#
					#..O..#
					#.....#
					#######

					<vv<<^^<<^^`,
				expected: 618,
			},
			{
				input: `
					##########
					#..O..O.O#
					#......O.#
					#.OO..O.O#
					#..O@..O.#
					#O#..O...#
					#O..O..O.#
					#.OO.O.OO#
					#....O...#
					##########

					<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
					vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
					><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
					<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
					^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
					^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
					>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
					<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
					^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
					v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`,
				expected: 9021,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
