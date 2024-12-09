import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput.split('').map(Number)

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)

	let count = 0
	let slot = 0

	let index = -1
	let backIndex = input.length % 2 === 0 ? input.length : input.length + 1
	let remainder = 0

	while (backIndex >= ++index) {
		let amount = backIndex !== index ? input[index] : remainder

		if (index % 2 === 0) {
			while (amount > 0) {
				amount--

				count += slot * (index / 2)
				slot++
			}
			continue
		}

		while (amount > 0) {
			amount--

			if (remainder === 0) {
				backIndex -= 2
				if (backIndex <= index) break
				remainder = input[backIndex]
			}
			remainder--

			count += slot * (backIndex / 2)
			slot++
		}
	}

	return count
}

function mergeEmptySlots(slots: { worth: number | null; amount: number }[], index: number) {
	if (slots[index + 1] && !slots[index + 1].worth) {
		slots[index].amount += slots[index + 1].amount
		slots.splice(index + 1, 1)
	}

	if (!slots[index - 1].worth) {
		slots[index - 1].amount += slots[index].amount
		slots.splice(index, 1)
	}
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)

	const slots = input.map((value, index) => ({
		worth: index % 2 === 0 ? index / 2 : null,
		amount: value,
	}))

	for (let i = slots.length - 1; i > 1; i--) {
		const slot = slots[i]
		if (!slot.worth) continue

		const gapIndex = slots.findIndex(
			(value, index) => value.worth === null && value.amount >= slot.amount && index < i
		)
		if (gapIndex === -1) continue

		slots.splice(i, 1, { worth: null, amount: slot.amount })
		mergeEmptySlots(slots, i)

		const space = slots[gapIndex].amount
		if (space === slot.amount) slots[gapIndex].worth = slot.worth
		else {
			slots[gapIndex].amount = space - slot.amount
			slots.splice(gapIndex, 0, slot)
		}
	}

	let index = 0
	return slots.reduce<number>((count, slot) => {
		if (!slot.worth) {
			index += slot.amount
			return count
		}
		while (slot.amount-- > 0) {
			count += slot.worth * index
			index++
		}
		return count
	}, 0)
}

run({
	part1: {
		tests: [
			{
				input: `2333133121414131402`,
				expected: 1928,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `2333133121414131402`,
				expected: 2858,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
