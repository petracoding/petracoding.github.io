document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".vocabulary-manager")) return;

  const removeDuplicatesCheckbox = document.querySelector("#removeDuplicates");
  const maxWordsCheckbox = document.querySelector("#maxWords");

  prepare();
  removeDuplicatesCheckbox.addEventListener("change", prepare);
  maxWordsCheckbox.addEventListener("change", prepare);

  function prepare() {
    document.querySelector(".wrap-removeDuplicates").style.display = removeDuplicatesCheckbox.checked ? "block" : "none";
    document.querySelector(".wrap-maxWords").style.display = maxWordsCheckbox.checked ? "block" : "none";
  }

  document.querySelector("#go").addEventListener("click", () => {
    let o;
    const input = document.querySelector("textarea").value;
    const separator = document.querySelector("#separator").value || "<br>";

    const words = input.trim().split(/[\n,]+/);
    const changedWords = changeArray(words);

    const sort = document.querySelector("#sort").checked;
    if (sort) changedWords.sort();

    const beforeNumber = words.length;
    const number = changedWords.length;
    const removedNumber = beforeNumber - number;
    document.querySelector("#outputNumber").innerHTML = number;
    document.querySelector("#outputRemovedNumber").innerHTML = removedNumber;
    document.querySelector("#outputLists").innerHTML = "1";

    const maxWords = document.querySelector("#maxWords").checked;

    if (maxWords) {
      const chunkify = function* (itr, size) {
        let chunk = [];
        for (const v of itr) {
          chunk.push(v);
          if (chunk.length === size) {
            yield chunk;
            chunk = [];
          }
        }
        if (chunk.length) yield chunk;
      };

      const maxWordsN = document.querySelector("#maxWordsN").value || 20;
      const randomizeOrder = document.querySelector("#randomizeOrder").checked;
      if (randomizeOrder) shuffleArray(changedWords);

      const chunkedLists = [...chunkify(changedWords, parseInt(maxWordsN))];
      o = "";
      [...chunkedLists].forEach((list) => {
        if (sort && randomizeOrder) list.sort();
        o += list.join(separator);
        o += "<hr>";
      });
      document.querySelector("#outputLists").innerHTML = chunkedLists.length;
    } else {
      o = changedWords.join(separator);
    }

    document.querySelector("#output").innerHTML = o;
  });
});

function changeArray(words) {
  const lowercase = document.querySelector("#lowercase").checked;
  const removePuncuation = document.querySelector("#removePuncuation").checked;
  const removeDuplicates = document.querySelector("#removeDuplicates").checked;
  const removeAdverbDuplicates = document.querySelector("#removeAdverbDuplicates").checked;
  const removePluralDuplicates = document.querySelector("#removePluralDuplicates").checked;
  const changedWords = [],
    duplicateWords = [];

  words.forEach((word) => {
    let changedWord = word.trim();
    if (lowercase) changedWord = changedWord.toLowerCase();

    if (removePuncuation) {
      changedWord = changedWord
        .replaceAll(",", "")
        .replaceAll(";", "")
        .replaceAll(":", "")
        .replaceAll(".", "")
        .replaceAll("!", "")
        .replaceAll("?", "")
        .replaceAll("'", "")
        .replaceAll('"', "")
        .replaceAll("“", "")
        .replaceAll("”", "");
    }

    let isDuplicate = false;
    if (removeDuplicates) {
      if (changedWords.includes(changedWord)) isDuplicate = true;

      if (removeAdverbDuplicates) {
        if (changedWords.includes(changedWord.replace(/ly$/, ""))) isDuplicate = true;
        if (changedWords.includes(changedWord.replace(/ily$/, "y"))) isDuplicate = true;
      }

      if (removePluralDuplicates) {
        if (changedWords.includes(changedWord.replace(/s$/, ""))) isDuplicate = true;
        if (changedWords.includes(changedWord.replace(/es$/, ""))) isDuplicate = true;
        if (changedWords.includes(changedWord.replace(/es$/, "e"))) isDuplicate = true;
      }
    }

    if (!isDuplicate) {
      changedWords.push(changedWord);
    } else {
      duplicateWords.push(changedWord);
    }
  });

  console.log("Removed Duplicate Words:");
  console.log(duplicateWords);

  return changedWords;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
