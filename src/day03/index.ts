import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('')

function getMul(input: string[], index: number): number {
	if (
		input[index] !== 'm' ||
		input[index + 1] !== 'u' ||
		input[index + 2] !== 'l' ||
		input[index + 3] !== '('
	) return 0

	const first = []
	const startFirst = index + 4
	for (let i = 0; i < first.length + 1; i++) {
		const element = input[startFirst + i]
		if (Number.isInteger(Number(element))) first.push(element)
		else if (element !== ',') return 0
	}

	const second = []
	const startSecond = index + 5 + first.length
	for (let i = 0; i < second.length + 1; i++) {
		const element = input[startSecond + i]
		if (Number.isInteger(Number(element))) second.push(element)
		else if (element !== ')') return 0
	}

	return Number(first.join('')) * Number(second.join(''))
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, _, index) => count + getMul(input, index), 0)
}

function checkToDisable(input: string[], index: number) {
	return (
		input[index] === 'd' &&
		input[index + 1] === 'o' &&
		input[index + 2] === 'n' &&
		input[index + 3] === "'" &&
		input[index + 4] === 't' &&
		input[index + 5] === '(' &&
		input[index + 6] === ')'
	)
}

function checkToEnable(input: string[], index: number) {
	return (
		input[index] === 'd' &&
		input[index + 1] === 'o' &&
		input[index + 2] === '(' &&
		input[index + 3] === ')'
	)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let enabled = true
	return input.reduce<number>((count, _, index) => {
		if (enabled) {
			enabled = !checkToDisable(input, index)
			if (!enabled) return count
		} else {
			enabled = checkToEnable(input, index)
			return count
		}

		return count + getMul(input, index)
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`,
				expected: 161,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`,
				expected: 48,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
