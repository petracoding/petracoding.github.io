document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".vocabulary-manager")) return;

  const removeDuplicatesCheckbox = document.querySelector("#removeDuplicates");
  const maxWordsCheckbox = document.querySelector("#maxWords");
  const removeWordsCheckbox = document.querySelector("#removeWords");

  prepare();
  removeDuplicatesCheckbox.addEventListener("change", prepare);
  maxWordsCheckbox.addEventListener("change", prepare);
  removeWordsCheckbox.addEventListener("change", prepare);

  function prepare() {
    document.querySelector(".wrap-removeDuplicates").style.display = removeDuplicatesCheckbox.checked ? "block" : "none";
    document.querySelector(".wrap-maxWords").style.display = maxWordsCheckbox.checked ? "block" : "none";
    document.querySelector(".wrap-removeWords").style.display = removeWordsCheckbox.checked ? "block" : "none";
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
        o += "<hr><p style='opacity:0;font-size: 1px;'>--------------------------</p>";
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
  const removePunctuation = document.querySelector("#removePunctuation").checked;
  const removeDuplicates = document.querySelector("#removeDuplicates").checked;
  const removeAdverbDuplicates = document.querySelector("#removeAdverbDuplicates").checked;
  const removePluralDuplicates = document.querySelector("#removePluralDuplicates").checked;
  const removeWords = document.querySelector("#removeWords").checked;
  const changedWords = [],
    duplicateWords = [],
    removedWords = [];

  words.forEach((word) => {
    let changedWord = word.trim();
    if (lowercase) changedWord = changedWord.toLowerCase();

    if (removePunctuation) {
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

    if (removeWords) {
      const wordsToRemove = document.querySelector("#wordsToRemove").value.toLowerCase();
      const wordsToRemoveArr = wordsToRemove
        .trim()
        .split(/[\n,]+/)
        .map((x) => x.trim());

      if (wordsToRemoveArr.includes(changedWord.toLowerCase()) || wordsToRemoveArr.includes(word.toLowerCase())) {
        removedWords.push(changedWord);
        changedWord = "";
      }
    }

    if (changedWord !== "") {
      if (!isDuplicate) {
        changedWords.push(changedWord);
      } else {
        duplicateWords.push(changedWord);
      }
    }
  });

  console.log("Removed Duplicate Words:");
  console.log(duplicateWords);
  console.log("Removed Words:");
  console.log(removedWords);
  console.log("--------------");

  return changedWords;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
