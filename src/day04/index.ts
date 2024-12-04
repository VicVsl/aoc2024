import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, line, i) => {
		return (count += line.reduce<number>((lineCount, element, j) => {
			if (element != 'X') return lineCount

			let toCheck = checkDirection({ letter: 'M', offset: 1, i, j, input })
			if (checkAllFalse(toCheck)) return lineCount

			toCheck = checkDirection({ letter: 'A', offset: 2, i, j, input, toCheck })
			if (checkAllFalse(toCheck)) return lineCount

			toCheck = checkDirection({ letter: 'S', offset: 3, i, j, input, toCheck })
			return (lineCount += Object.values(toCheck).filter(v => v).length)
		}, 0))
	}, 0)
}

type Directions = {
	leftTop: boolean
	top: boolean
	rightTop: boolean
	left: boolean
	right: boolean
	leftBottom: boolean
	bottom: boolean
	rightBottom: boolean
}

function checkAllFalse(toCheck: Directions): boolean {
	return !Object.values(toCheck).some(value => value)
}

function filterDirections(params: {
	offset: number
	i: number
	j: number
	input: string[][]
	toCheck?: Directions
}): Directions {
	const { offset, i, j, input } = params
	let toCheck = params.toCheck

	if (!toCheck) {
		toCheck = {
			leftTop: true,
			top: true,
			rightTop: true,
			left: true,
			right: true,
			leftBottom: true,
			bottom: true,
			rightBottom: true,
		}
	}

	if (i - offset < 0) {
		toCheck.leftTop = false
		toCheck.top = false
		toCheck.rightTop = false
	}

	if (j - offset < 0) {
		toCheck.leftTop = false
		toCheck.left = false
		toCheck.leftBottom = false
	}

	if (i + offset > input.length - 1) {
		toCheck.leftBottom = false
		toCheck.bottom = false
		toCheck.rightBottom = false
	}

	if (j + offset > input[0].length - 1) {
		toCheck.rightTop = false
		toCheck.right = false
		toCheck.rightBottom = false
	}

	return toCheck
}

function checkDirection(params: {
	letter: string
	offset: number
	i: number
	j: number
	input: string[][]
	toCheck?: Directions
}): Directions {
	const toCheck = filterDirections(params)
	const { letter, offset, i, j, input } = params

	toCheck.leftTop = toCheck.leftTop ? input[i - offset][j - offset] === letter : false
	toCheck.top = toCheck.top ? input[i - offset][j] === letter : false
	toCheck.rightTop = toCheck.rightTop ? input[i - offset][j + offset] === letter : false
	toCheck.left = toCheck.left ? input[i][j - offset] === letter : false
	toCheck.right = toCheck.right ? input[i][j + offset] === letter : false
	toCheck.leftBottom = toCheck.leftBottom ? input[i + offset][j - offset] === letter : false
	toCheck.bottom = toCheck.bottom ? input[i + offset][j] === letter : false
	toCheck.rightBottom = toCheck.rightBottom ? input[i + offset][j + offset] === letter : false

	return toCheck
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, line, i) => {
		return (count += line.reduce<number>((lineCount, element, j) => {
			if (element != 'A') return lineCount
			if (i === 0 || i === input.length - 1 || j === 0 || j === input[0].length - 1) return lineCount

			return ((input[i - 1][j - 1] === 'M' && input[i + 1][j + 1] === 'S') ||
				(input[i - 1][j - 1] === 'S' && input[i + 1][j + 1] === 'M')) &&
				((input[i - 1][j + 1] === 'M' && input[i + 1][j - 1] === 'S') ||
					(input[i - 1][j + 1] === 'S' && input[i + 1][j - 1] === 'M'))
				? ++lineCount
				: lineCount
		}, 0))
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
				expected: 18,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`,
				expected: 9,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
