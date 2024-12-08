import run from 'aocrunner'

const parseInput = (rawInput: string) =>
	rawInput.split('\n').reduce<Map<string, { x: number; y: number }[]>>((map, line, y) => {
		line.split('').forEach((char, x) => {
			if (char === '.') return

			if (!map.has(char)) {
				map.set(char, [])
			}
			map.get(char)!.push({ x, y })
		})
		return map
	}, new Map())

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const maxX = rawInput.split('\n')[0].split('').length - 1
	const maxY = rawInput.split('\n').length - 1

	const set: Set<string> = new Set()
	const addToSet = (cords: { x: number; y: number }): boolean => {
		if (cords.x < 0 || cords.x > maxX || cords.y < 0 || cords.y > maxY) return false
		set.add(JSON.stringify(cords))
		return true
	}

	input.forEach(list =>
		list.reduce<{ x: number; y: number }[]>((past, cords) => {
			past.forEach(({ x, y }) => {
				const difX = cords.x - x
				const difY = cords.y - y

				addToSet({ x: cords.x + difX, y: cords.y + difY })
				addToSet({ x: x - difX, y: y - difY })
			})

			past.push(cords)
			return past
		}, [])
	)

	return set.size
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const maxX = rawInput.split('\n')[0].split('').length - 1
	const maxY = rawInput.split('\n').length - 1

	const set: Set<string> = new Set()
	const addToSet = (cords: { x: number; y: number }): boolean => {
		if (cords.x < 0 || cords.x > maxX || cords.y < 0 || cords.y > maxY) return false
		set.add(JSON.stringify(cords))
		return true
	}

	input.forEach(list =>
		list.reduce<{ x: number; y: number }[]>((past, cords) => {
			past.forEach(({ x, y }) => {
				const difX = cords.x - x
				const difY = cords.y - y

				let times = 0
				while (true) {
					times++
					if (!addToSet({ x: cords.x + difX * times, y: cords.y + difY * times })) break
				}

				times = 0
				while (true) {
					times++
					if (!addToSet({ x: x - difX * times, y: y - difY * times })) break
				}
			})

			addToSet(cords)
			past.push(cords)
			return past
		}, [])
	)

	return set.size
}

run({
	part1: {
		tests: [
			{
				input: `
					............
					........0...
					.....0......
					.......0....
					....0.......
					......A.....
					............
					............
					........A...
					.........A..
					............
					............`,
				expected: 14,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					............
					........0...
					.....0......
					.......0....
					....0.......
					......A.....
					............
					............
					........A...
					.........A..
					............
					............`,
				expected: 34,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
