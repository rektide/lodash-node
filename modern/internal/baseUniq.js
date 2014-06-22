/**
 * Lo-Dash 3.0.0-pre (Custom Build) <http://lodash.com/>
 * Build: `lodash modularize modern exports="node" -o ./modern/`
 * Copyright 2012-2014 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.6.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
var baseIndexOf = require('./baseIndexOf'),
    cacheIndexOf = require('./cacheIndexOf'),
    createCache = require('./createCache');

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {boolean} [isSorted=false] Specify the array is sorted.
 * @param {Function} [iterator] The function called per iteration.
 * @returns {Array} Returns the new duplicate-value-free array.
 */
function baseUniq(array, isSorted, iterator) {
  var length = array ? array.length : 0;
  if (!length) {
    return [];
  }
  var index = -1,
      indexOf = baseIndexOf,
      prereq = !isSorted,
      isLarge = prereq && createCache && length >= 200,
      isCommon = prereq && !isLarge,
      result = [];

  if (isLarge) {
    var seen = createCache();
    indexOf = cacheIndexOf;
  } else {
    seen = (iterator && !isSorted) ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iterator ? iterator(value, index, array) : value;

    if (isCommon) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iterator) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (isSorted) {
      if (!index || seen !== computed) {
        seen = computed;
        result.push(value);
      }
    }
    else if (indexOf(seen, computed) < 0) {
      if (iterator || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;