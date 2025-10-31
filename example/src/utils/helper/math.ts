const isNumber = (num: string): boolean => {
    return !isNaN(parseFloat(String(num)))
  }
  
  const tryParseNumber = (num: any): any => {
    if (isNumber(num)) {
      return parseFloat(String(num))
    }
    return num
  }
  
  const roundMaxFixed = (num: number, decimals: number): number => {
    return Number(
      Math.round(Number(String(num + 'e' + decimals))) + 'e-' + decimals,
    )
  }
  
  export {
    isNumber,
    tryParseNumber,
    roundMaxFixed,

  }
  