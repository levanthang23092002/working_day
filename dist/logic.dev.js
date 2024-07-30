"use strict";

var a = [{
  "start_day": 3,
  "end_day": 10
}, {
  "start_day": 3,
  "end_day": 8
}, {
  "start_day": 12,
  "end_day": 25
}, {
  "start_day": 12,
  "end_day": 26
}];

function merged(arr) {
  var tg = arr.length - 1;
  arr.sort(function (a, b) {
    return a.start_day - b.start_day;
  });

  for (var i = 0; i < tg; i++) {
    if (arr[i].end_day >= arr[i + 1].start_day) {
      arr[i + 1].start_day = arr[i].start_day;

      if (arr[i].end_day > arr[i + 1].end_day) {
        arr[i + 1].end_day = arr[i].end_day;
      }
    }
  }

  var result = Object.values(arr.reduce(function (acc, item) {
    acc[item.start_day] = item;
    return acc;
  }, {}));
  return result;
}

console.log(merged(a));