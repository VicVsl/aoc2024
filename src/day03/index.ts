import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, _, index) => {
		const first = []
		const second = []

		if (input[index] !== 'm') return count
		if (input[index + 1] !== 'u') return count
		if (input[index + 2] !== 'l') return count
		if (input[index + 3] !== '(') return count
		if (!Number.isNaN(parseInt(input[index + 4]))) first.push(input[index + 4])

		for (let i = 0; i < first.length; i++) {
			const element = input[index + 5 + i]
			if (!Number.isNaN(parseInt(element))) first.push(element)
			else if (element !== ',') return count
		}

		if (!Number.isNaN(parseInt(input[index + 5 + first.length]))) second.push(input[index + 5 + first.length])

		for (let i = 0; i < second.length; i++) {
			const element = input[index + 6 + first.length + i]
			if (!Number.isNaN(parseInt(element))) second.push(element)
			else if (element !== ')') return count
		}

		return count + parseInt(first.join('')) * parseInt(second.join(''))
	}, 0)
}

function checkToDisable(input: string[], index: number) {
	if (input[index] !== 'd') return false
	if (input[index + 1] !== 'o') return false
	if (input[index + 2] !== 'n') return false
	if (input[index + 3] !== '\'') return false
	if (input[index + 4] !== 't') return false
	if (input[index + 5] !== '(') return false
	if (input[index + 6] !== ')') return false
	return true
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let enabled = true
	return input.reduce<number>((count, _, index) => {
		if (!enabled) {
			if (input[index] !== 'd') return count
			if (input[index + 1] !== 'o') return count
			if (input[index + 2] !== '(') return count
			if (input[index + 3] !== ')') return count
			enabled = true
			return count
		}

		if (enabled) {
			enabled = !checkToDisable(input, index)
			if (!enabled) return count
		}

		const first = []
		const second = []

		if (input[index] !== 'm') return count
		if (input[index + 1] !== 'u') return count
		if (input[index + 2] !== 'l') return count
		if (input[index + 3] !== '(') return count
		if (!Number.isNaN(parseInt(input[index + 4]))) first.push(input[index + 4])

		for (let i = 0; i < first.length; i++) {
			const element = input[index + 5 + i]
			if (!Number.isNaN(parseInt(element))) first.push(element)
			else if (element !== ',') return count
		}

		if (!Number.isNaN(parseInt(input[index + 5 + first.length]))) second.push(input[index + 5 + first.length])

		for (let i = 0; i < second.length; i++) {
			const element = input[index + 6 + first.length + i]
			if (!Number.isNaN(parseInt(element))) second.push(element)
			else if (element !== ')') return count
		}

		return count + parseInt(first.join('')) * parseInt(second.join(''))
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
