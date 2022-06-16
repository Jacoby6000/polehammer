export function shuffle<T>(arr: T[]) {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
}

export function filterSet<A>(set: Set<A>, f: (a: A) => boolean): Set<A> {
  let results: Array<A> = [];
  set.forEach(a => {
    if(f(a))
      results.push(a)
  });
  return new Set(results);
}


export function subsets<A, B>(set: Set<A>, f: (a: A) => B): Map<B, Set<A>> {
  let results = new Map<B, Set<A>>();
  set.forEach(a => {
    let k = f(a);
    let current = new Set<A>();
    if(results.has(k)) {
      current = results.get(k)!;
    } 
    current.add(a);
    results.set(k, current);
  });
  return results
}
