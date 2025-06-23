let array = [];
let delay = 50;

function generateArray() {
  const container = document.getElementById("array-container");
  container.innerHTML = "";
  const size = document.getElementById("size").value;
  array = [];
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 300) + 10;
    array.push(val);
    const bar = document.createElement("div");
    bar.style.height = val + "px";
    bar.classList.add("bar");
    container.appendChild(bar);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort() {
  delay = 101 - document.getElementById("speed").value;
  const algo = document.getElementById("algorithm").value;
  switch (algo) {
    case "bubble": await bubbleSort(); break;
    case "insertion": await insertionSort(); break;
    case "selection": await selectionSort(); break;
    case "merge": await mergeSortWrapper(); break;
    case "quick": await quickSortWrapper(); break;
  }
}

async function bubbleSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].classList.add("active");
      bars[j + 1].classList.add("active");
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = array[j] + "px";
        bars[j + 1].style.height = array[j + 1] + "px";
      }
      await sleep(delay);
      bars[j].classList.remove("active");
      bars[j + 1].classList.remove("active");
    }
    bars[array.length - i - 1].classList.add("sorted");
  }
  bars[0].classList.add("sorted");
}

async function insertionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      bars[j + 1].style.height = array[j] + "px";
      bars[j].classList.add("active");
      await sleep(delay);
      bars[j].classList.remove("active");
      j--;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = key + "px";
  }
  bars.forEach(bar => bar.classList.add("sorted"));
}

async function selectionSort() {
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    bars[i].style.height = array[i] + "px";
    bars[minIdx].style.height = array[minIdx] + "px";
    bars[i].classList.add("sorted");
    await sleep(delay);
  }
}

async function mergeSortWrapper() {
  await mergeSort(array, 0, array.length - 1);
  document.querySelectorAll(".bar").forEach(bar => bar.classList.add("sorted"));
}

async function mergeSort(arr, l, r) {
  if (l < r) {
    const m = Math.floor((l + r) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  }
}

async function merge(arr, l, m, r) {
  let left = arr.slice(l, m + 1);
  let right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  const bars = document.querySelectorAll(".bar");

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      arr[k] = left[i++];
    } else {
      arr[k] = right[j++];
    }
    bars[k].style.height = arr[k] + "px";
    await sleep(delay);
    k++;
  }
  while (i < left.length) {
    arr[k] = left[i++];
    bars[k].style.height = arr[k] + "px";
    await sleep(delay);
    k++;
  }
  while (j < right.length) {
    arr[k] = right[j++];
    bars[k].style.height = arr[k] + "px";
    await sleep(delay);
    k++;
  }
}

async function quickSortWrapper() {
  await quickSort(array, 0, array.length - 1);
  document.querySelectorAll(".bar").forEach(bar => bar.classList.add("sorted"));
}

async function quickSort(arr, low, high) {
  if (low < high) {
    const pi = await partition(arr, low, high);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  }
}

async function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  const bars = document.querySelectorAll(".bar");

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      bars[i].style.height = arr[i] + "px";
      bars[j].style.height = arr[j] + "px";
      await sleep(delay);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  bars[i + 1].style.height = arr[i + 1] + "px";
  bars[high].style.height = arr[high] + "px";
  return i + 1;
}

generateArray();


const descriptions = {
  bubble: {
    desc: "Bubble Sort is a simple comparison-based algorithm where each pair of adjacent elements is compared and the elements are swapped if they are not in order.",
    time: "Best: O(n), Average/Worst: O(n²)"
  },
  insertion: {
    desc: "Insertion Sort builds the sorted array one item at a time, with each new element being inserted into the correct position.",
    time: "Best: O(n), Average/Worst: O(n²)"
  },
  selection: {
    desc: "Selection Sort divides the input into a sorted and unsorted region, selecting the smallest element from the unsorted region and moving it to the sorted region.",
    time: "All Cases: O(n²)"
  },
  merge: {
    desc: "Merge Sort is a divide-and-conquer algorithm that splits the array into halves, recursively sorts them, and then merges the sorted halves.",
    time: "Best/Average/Worst: O(n log n)"
  },
  quick: {
    desc: "Quick Sort selects a pivot element and partitions the array around the pivot, sorting recursively. It’s very efficient for large datasets.",
    time: "Best/Average: O(n log n), Worst: O(n²)"
  }
};

function updateDescription() {
  const algo = document.getElementById("algorithm").value;
  document.getElementById("algo-description").innerText = descriptions[algo].desc;
  document.getElementById("algo-complexity").innerText = descriptions[algo].time;
}

// Sound effect on comparisons
function playSound() {
  if (!document.getElementById("sound").checked) return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(440, context.currentTime);
  oscillator.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.05);
}

// Modify sleep to add sound
async function sleep(ms) {
  playSound();
  return new Promise(resolve => setTimeout(resolve, ms));
}

updateDescription(); // load initial description