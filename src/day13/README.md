# 🎄 Advent of Code 2024 - day 13 🎄

## Info

Task description: [link](https://adventofcode.com/2024/day/13)

## Notes
a * x1 + b * x2 = x3
a * y1 + b * y2 = y3

a = (x3 - b * x2) / x1

((x3 - b * x2) / x1) * y1 + b * y2 = y3
(b * -x2 * y1) / x1 + b * y2 = y3 - (x3 * y1 / x1) 
b * ((-x2 * y1) / x1 + y2) = y3 - (x3 * y1 / x1)
b = (y3 -(x3 * y1 / x1)) / ((-x2 * y1) / x1 + y2)

a = (x3 - ((y3 - (x3 * y1 / x1)) / (((-x2 * y1) / x1) + y2)) * x2) / x1
a = (x3 - ((y3 - (x3 * y1 / x1)) * x2) / (((-x2 * y1) / x1) + y2)) / x1

...