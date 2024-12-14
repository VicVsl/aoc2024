import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n\n')
	.map(machine => machine.split('\n')
		.map(line => line.match(/\d+/g)?.map(Number)))

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	// console.log(input)
	return input.reduce<number>((count, machine) => {
		const [a, b, prize] = machine
		const [ax, ay] = a!
		const [bx, by] = b!
		const [px, py] = prize!

		const ySol = (py - (px * ay / ax)) / ((-bx * ay) / ax + by)
		const xSol = (px - ySol * bx) / ax

		const checkInt = (val: number) => Math.abs(val - Math.round(val)) < 1e-10
		if (checkInt(xSol) && checkInt(ySol)) count += 3 * xSol + ySol

		return count
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, machine) => {
		const [a, b, prize] = machine
		const [ax, ay] = a!
		const [bx, by] = b!
		let [px, py] = prize!
		px += 10000000000000
		py += 10000000000000

		const ySol = (py - (px * ay / ax)) / ((-bx * ay) / ax + by)
		const xSol = (px - ySol * bx) / ax

		const checkInt = (val: number) => Math.abs(val - Math.round(val)) < 1e-2
		if (checkInt(xSol) && checkInt(ySol)) count += 3 * xSol + ySol

		return count
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `
					Button A: X+94, Y+34
					Button B: X+22, Y+67
					Prize: X=8400, Y=5400

					Button A: X+26, Y+66
					Button B: X+67, Y+21
					Prize: X=12748, Y=12176

					Button A: X+17, Y+86
					Button B: X+84, Y+37
					Prize: X=7870, Y=6450

					Button A: X+69, Y+23
					Button B: X+27, Y+71
					Prize: X=18641, Y=10279`,
				expected: 480,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					Button A: X+94, Y+34
					Button B: X+22, Y+67
					Prize: X=8400, Y=5400

					Button A: X+26, Y+66
					Button B: X+67, Y+21
					Prize: X=12748, Y=12176

					Button A: X+17, Y+86
					Button B: X+84, Y+37
					Prize: X=7870, Y=6450

					Button A: X+69, Y+23
					Button B: X+27, Y+71
					Prize: X=18641, Y=10279`,
				expected: 875318608908,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
