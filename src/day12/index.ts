import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('\n').map(line => line.split(''))

type regions = {
	points: { x: number; y: number }[]
	edges: number
}[]

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const map = input.reduce<Map<string, regions>>((map, line, y) => {
		line.forEach((letter, x) => {
			const regions = map.get(letter)
			if (!regions) {
				return map.set(letter, [{
					points: [{ x, y }],
					edges: 4,
				}])
			}

			let mergeRegions: regions = []
			let newRegion = true
			regions.forEach(region => {
				const neighbors = region.points.filter(
					point => Math.abs(point.x - x) + Math.abs(point.y - y) === 1
				)

				if (neighbors.length === 0) return
				else if (neighbors.length === 1) region.edges += 2
				else if (neighbors.length === 2) region.edges += 0

				region.points.push({ x, y })
				mergeRegions.push(region)
				newRegion = false
			})

			if (mergeRegions.length > 1) {
				const [first, second] = mergeRegions

				regions.splice(regions.indexOf(first), 1)
				regions.splice(regions.indexOf(second), 1)

				second.points.splice(second.points.indexOf({ x, y }), 1)
				first.points.push(...second.points)

				first.edges += second.edges - 4

				regions.push(first)
			}

			if (newRegion) {
				regions.push({
					points: [{ x, y }],
					edges: 4,
				})
			}

			map.set(letter, regions)
		})
		return map
	}, new Map())

	return Array.from(map.values()).reduce((count, regions) => {
		return count + regions.reduce((acc, { points, edges }) => acc + points.length * edges, 0)
	}, 0)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const map = input.reduce<Map<string, regions>>((map, line, y) => {
		line.forEach((letter, x) => {
			const regions = map.get(letter)
			if (!regions) {
				return map.set(letter, [{
					points: [{ x, y }],
					edges: 4,
				}])
			}

			let mergeRegions: regions = []
			let newRegion = true
			regions.forEach(region => {
				const neighbors = region.points.filter(
					point => Math.abs(point.x - x) + Math.abs(point.y - y) === 1
				)
				const nAmount = neighbors.length
				if (nAmount === 0) return

				const diagonalNeighbors = region.points.filter(
					point => Math.abs(point.x - x) === 1 && Math.abs(point.y - y) === 1
				)
				const dnAmount = diagonalNeighbors.length

				if (nAmount === 1) {
					if (dnAmount === 0) region.edges += 0
					else if (dnAmount === 1) {
						if (
							neighbors[0].x === diagonalNeighbors[0].x ||
							neighbors[0].y === diagonalNeighbors[0].y
						) region.edges += 2
						else region.edges += 0
					} else if (dnAmount === 2) {
						if (
							(diagonalNeighbors[0].x === diagonalNeighbors[1].x &&
								neighbors[0].x === diagonalNeighbors[0].x) ||
							(diagonalNeighbors[0].y === diagonalNeighbors[1].y &&
								neighbors[0].y === diagonalNeighbors[0].y)
						) region.edges += 4
						else region.edges += 2
					}
				} else if (nAmount === 2) {
					if (dnAmount === 0) region.edges -= 2
					else if (dnAmount === 1) {
						if (
							(neighbors[0].x === diagonalNeighbors[0].x &&
								neighbors[1].y === diagonalNeighbors[0].y) ||
							(neighbors[1].x === diagonalNeighbors[0].x &&
								neighbors[0].y === diagonalNeighbors[0].y)
						) region.edges -= 2
						else region.edges += 0
					} else if (dnAmount === 2) region.edges += 0
				}

				region.points.push({ x, y })
				mergeRegions.push(region)
				newRegion = false
			})

			if (mergeRegions.length > 1) {
				const [first, second] = mergeRegions

				regions.splice(regions.indexOf(first), 1)
				regions.splice(regions.indexOf(second), 1)

				second.points.splice(second.points.indexOf({ x, y }), 1)
				first.points.push(...second.points)

				first.edges += second.edges - 2

				regions.push(first)
			}

			if (newRegion) {
				regions.push({
					points: [{ x, y }],
					edges: 4,
				})
			}

			map.set(letter, regions)
		})
		return map
	}, new Map())

	return Array.from(map.values()).reduce((count, regions) => {
		return count + regions.reduce((acc, { points, edges }) => acc + points.length * edges, 0)
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `
					RRRRIICCFF
					RRRRIICCCF
					VVRRRCCFFF
					VVRCCCJFFF
					VVVVCJJCFE
					VVIVCCJJEE
					VVIIICJJEE
					MIIIIIJJEE
					MIIISIJEEE
					MMMISSJEEE`,
				expected: 1930,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					AAAA
					BBCD
					BBCC
					EEEC`,
				expected: 80,
			},
			{
				input: `
					EEEEE
					EXXXX
					EEEEE
					EXXXX
					EEEEE`,
				expected: 236,
			},
			{
				input: `
					AAAAAA
					AAABBA
					AAABBA
					ABBAAA
					ABBAAA
					AAAAAA`,
				expected: 368,
			},
			{
				input: `
					OOOOO
					OXOXO
					OOOOO
					OXOXO
					OOOOO`,
				expected: 436,
			},
			{
				input: `
					AAAAAAAA
					AACBBDDA
					AACBBAAA
					ABBAAAAA
					ABBADDDA
					AAAADADA
					AAAAAAAA`,
				expected: 946,
			},
			{
				input: `
					RRRRIICCFF
					RRRRIICCCF
					VVRRRCCFFF
					VVRCCCJFFF
					VVVVCJJCFE
					VVIVCCJJEE
					VVIIICJJEE
					MIIIIIJJEE
					MIIISIJEEE
					MMMISSJEEE`,
				expected: 1206,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
