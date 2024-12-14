import run from 'aocrunner'
import fs from 'fs/promises'

const parseInput = (rawInput: string) => rawInput.split('\n').map(line =>
	line.split(' ').map(cords => {
		const x = cords.match(/-?\d+/g)
		if (!x) return []
		return x.map(Number)
	})
)

function computeModulo(val: number, modulo: number) {
	return ((val % modulo) + modulo) % modulo
}

function getRobotsPositions(time: number, robots: number[][][], xSize: number, ySize: number) {
	return robots.map(([start, speed]) => {
		const [sx, sy] = start
		const [vx, vy] = speed

		const x = computeModulo(sx + time * vx, xSize)
		const y = computeModulo(sy + time * vy, ySize)

		return [x, y]
	})
}

function renderMap(robotsPositions: number[][], xSize: number, ySize: number) {
	let map = Array.from({ length: ySize }, () => Array(xSize).fill(' ')) // Empty grid

	robotsPositions.forEach(([rx, ry]) => {
		map[ry][rx] = '#'
	})

	return map.map(row => row.join('')).join('\n')
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const final = input.length > 20
	const xSize = final ? 101 : 11
	const ySize = final ? 103 : 7

	const xMiddle = Math.floor(xSize / 2)
	const yMiddle = Math.floor(ySize / 2)

	const quadrants = input.reduce<number[]>((count, robot) => {
		const [start, speed] = robot
		const [sx, sy] = start!
		const [vx, vy] = speed!

		const ex = sx + 100 * vx
		const ey = sy + 100 * vy

		const exRoom = computeModulo(ex, xSize)
		const eyRoom = computeModulo(ey, ySize)

		if (eyRoom < yMiddle) {
			if (exRoom < xMiddle) count[0]++
			if (exRoom > xMiddle) count[1]++
		} else if (eyRoom > yMiddle) {
			if (exRoom < xMiddle) count[2]++
			if (exRoom > xMiddle) count[3]++
		}

		return count
	}, [0, 0, 0, 0])

	return quadrants.reduce((acc, val) => acc * val)
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const final = input.length > 20
	const xSize = final ? 101 : 11
	const ySize = final ? 103 : 7

	const maxTime = 10000

	let output = ''

	for (let time = 0; time <= maxTime; time++) {
		const robotsPositions = getRobotsPositions(time, input, xSize, ySize)
		const gridString = renderMap(robotsPositions, xSize, ySize)

		output += `Time: ${time}\n`
		output += gridString + '\n\n'
	}

	fs.writeFile('src/day14/robots.txt', output)
	console.log(`Simulation written`)

	return 6587
}

run({
	part1: {
		tests: [
			{
				input: `
					p=0,4 v=3,-3
					p=6,3 v=-1,-3
					p=10,3 v=-1,2
					p=2,0 v=2,-1
					p=0,0 v=1,3
					p=3,0 v=-2,-2
					p=7,6 v=-1,-3
					p=3,0 v=-1,-2
					p=9,3 v=2,3
					p=7,3 v=-1,2
					p=2,4 v=2,-3
					p=9,5 v=-3,-3]`,
				expected: 12,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
