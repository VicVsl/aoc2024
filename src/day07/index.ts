import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput.split('\n').map(line => {
		const [res, list] = line.split(': ')
		return {
			res: Number(res),
			list: list.split(' ').map(Number),
		}
	})

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, { res, list }) => {
		const permutations = list.reduce<number[]>(
			(acc, val) => {
				const newAcc: number[] = []
				acc.forEach(accVal => {
					if (accVal > res) return

					newAcc.push(accVal + val)
					newAcc.push(accVal * val)
				})
				return newAcc
			},
			[1]
		)
		if (permutations.includes(res)) count += res
		return count
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, { res, list }) => {
		const permutations = list.reduce<number[]>(
			(acc, val) => {
				const newAcc: number[] = []
				acc.forEach(accVal => {
					if (accVal > res) return

					newAcc.push(accVal + val)
					newAcc.push(accVal * val)
					newAcc.push(Number(`${accVal}${val}`))
				})
				return newAcc
			},
			[1]
		)
		if (permutations.includes(res)) count += res
		return count
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
				expected: 3749,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
				expected: 11387,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
