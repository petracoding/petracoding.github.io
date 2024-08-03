document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".manual-list-sorter")) return;

  const startBtn = document.querySelector("#start");
  const btn1 = document.querySelector("#sortInto1");
  const btn2 = document.querySelector("#sortInto2");
  const inputListTextarea = document.querySelector("#input");
  const outputTextarea1 = document.querySelector("#output1");
  const outputTextarea2 = document.querySelector("#output2");
  const wordSpan = document.querySelector("#word");

  let inputList,
    list1 = [],
    list2 = [],
    currentIndex;

  startBtn.removeAttribute("disabled");
  inputListTextarea.removeAttribute("disabled");
  btn1.setAttribute("disabled", "true");
  btn2.setAttribute("disabled", "true");

  startBtn.addEventListener("click", () => {
    if (!inputListTextarea.value) {
      alert("No items inserted!");
    } else {
      outputTextarea1.value = "";
      outputTextarea2.value = "";
      inputList = inputListTextarea.value.replace(/,\s*$/, "").replaceAll(",,", ",").split(",");
      currentIndex = -1;
      inputListTextarea.setAttribute("disabled", "true");
      startBtn.setAttribute("disabled", "true");
      btn1.removeAttribute("disabled");
      btn2.removeAttribute("disabled");
      wordSpan.innerHTML = inputList[currentIndex];
      nextItem();

      window.onbeforeunload = function () {
        return "Are you sure you want to navigate away?";
      };
    }
  });

  btn1.addEventListener("click", () => {
    list1.push(inputList[currentIndex]);
    outputTextarea1.value = list1.join(", ");
    nextItem();
  });

  btn2.addEventListener("click", () => {
    list2.push(inputList[currentIndex]);
    outputTextarea2.value = list2.join(", ");
    nextItem();
  });

  function nextItem() {
    if (currentIndex == inputList.length - 1) {
      wordSpan.innerHTML = "DONE!";
      startBtn.removeAttribute("disabled");
      inputListTextarea.removeAttribute("disabled");
      btn1.setAttribute("disabled", "true");
      btn2.setAttribute("disabled", "true");
    } else {
      currentIndex++;
      wordSpan.innerHTML = inputList[currentIndex];
    }
  }
});
