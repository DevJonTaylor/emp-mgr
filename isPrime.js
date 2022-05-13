const isPrime = (n, i = 3, sq = 0) => (n <= 1 || !(n % 2) && n > 2) 
  ? false 
  : !sq 
    ? isPrime(n, i, Math.sqrt(n))
    : !(n % i)
      ? n < sq
        ? isPrime(n, i += 2, sq)
        : false 
      : true

console.log(isPrime(2))
console.log(isPrime(62))
console.log(isPrime(73))
console.log(isPrime(3))
console.log(isPrime(9))