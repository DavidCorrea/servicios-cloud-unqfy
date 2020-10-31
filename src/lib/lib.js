module.exports = {
  flatMap: arrayOfArrays => arrayOfArrays.reduce((all, array) => all.concat(array), []),

  unique: array => [...new Set(array)],

  firstN: (array, n) => array.slice(0, n),

  sortRandomly: array => { 
    array.sort(() => Math.random() - 0.5);

    return array;
  },
}
