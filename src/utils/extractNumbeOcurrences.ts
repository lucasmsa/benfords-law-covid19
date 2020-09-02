import countOcurrences from './countOcurrences'

interface PercentageData {
  [key: string]: number;
}

const getNumberOcurrences = (arr: number[]) => {
  const valueToPercentage: PercentageData = {}

  for (var number = 1; number < 10; number++) {
    valueToPercentage[number.toString()] = 
        Number(
          parseFloat((countOcurrences(arr, number)*100/arr.length)
          .toString())
          .toFixed(2))
  }

  return valueToPercentage
}

export default getNumberOcurrences