import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput.split('\n').reduce<number[][]>((list, line) => {
		list.push(line.split(' ').map(Number))
		return list
	}, [])

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, report) => {
		const problematicIndex = checkReport(report)
		if (problematicIndex == -1) count++
		return count
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	return input.reduce<number>((count, report) => {
		const problematicIndex = checkReport(report)
		if (problematicIndex == -1) return ++count

		const previousProblematicIndex = checkReport(removeFromArray(report, problematicIndex - 1))
		const nextProblematicIndex = checkReport(removeFromArray(report, problematicIndex + 1))
		const currentProblematicIndex = checkReport(removeFromArray(report, problematicIndex))

		if (previousProblematicIndex === -1 || nextProblematicIndex === -1 || currentProblematicIndex === -1) count++

		return count
	}, 0)
}

function checkReport(report: number[]): number {
	let problematicIndex: number = -1

	for (let i = 0; i < report.length - 1; i++) {
		const level = report[i]
		const nextLevel = i < report.length - 1 ? report[i + 1] : null
		const prevLevel = i > 0 ? report[i - 1] : null

		if (!nextLevel || !prevLevel) continue

		if (
			(nextLevel >= level && prevLevel >= level) ||
			(nextLevel <= level && prevLevel <= level) ||
			Math.abs(nextLevel - level) > 3 ||
			Math.abs(prevLevel - level) > 3
		) {
			problematicIndex = i
			break
		}
	}

	return problematicIndex
}

export function removeFromArray<T extends unknown[]>(arr: T, i: number) {
	const copy = [...arr]
	copy.splice(i, 1)
	return copy
}

run({
	part1: {
		tests: [
			{
				input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
				expected: 2,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
7 9 6 4 2`,
				expected: 5,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
