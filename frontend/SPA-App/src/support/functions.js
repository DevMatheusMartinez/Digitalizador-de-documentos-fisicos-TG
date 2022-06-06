import { maskRenavam } from "./masks"

export const addZeroesRenavam = (num, len) => {
    let numberWithZeroes = String(num)
    let counter = numberWithZeroes.length

    while (counter < len) {

        numberWithZeroes = `0${numberWithZeroes}` 

        counter++

    }

    return  maskRenavam(numberWithZeroes)
}