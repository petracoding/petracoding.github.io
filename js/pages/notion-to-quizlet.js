document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector(".notion-to-quizlet")) return;

  const inputEl = document.querySelector("#input");
  const output1 = document.querySelector("#output1");
  const output2 = document.querySelector("#output2");

  generateOutput1(inputEl.value);
  //   generateOutput2(inputEl.value);

  inputEl.addEventListener("change", () => {
    generateOutput1(inputEl.value);
    // generateOutput2(inputEl.value);
  });
  inputEl.addEventListener("input", () => {
    generateOutput1(inputEl.value);
    // generateOutput2(inputEl.value);
  });

  function generateOutput1(input) {
    const bulletPoints = ["■", "✦", "✧", "●", "⬥"];
    const output = input
      .replaceAll(/\*\*(.+)\*\*/g, "$1") // remove bold
      .replaceAll(/\*(.+)\*/g, "$1") // remove italic
      .replaceAll(/\s+!\[.*\]\(.*\)\s+/g, "\n") // remove images
      .replaceAll("                -", " ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍ ‍ ‍ ‍‍ ‍‍ ‍ " + bulletPoints[4]) // level 5
      .replaceAll("            -", " ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍‍ ‍ ‍" + bulletPoints[3]) // level 4
      .replaceAll("        -", " ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍ ‍‍ ‍" + bulletPoints[2]) // level 3
      .replaceAll("    -", " ‍ ‍‍ ‍ ‍‍ " + bulletPoints[1]) // level 2
      .replaceAll("- ", bulletPoints[0] + " "); // level 1
    output1.value = output;
    copyToClipboard(output1.value);
  }

  //   function generateOutput2(input) {
  //     const output = input
  //       .replaceAll(/\*\*(.+)\*\*/g, "<b>$1</b>")
  //       .replaceAll("            -", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-")
  //       .replaceAll("        -", "&nbsp;&nbsp;&nbsp;&nbsp;-")
  //       .replaceAll("    -", "&nbsp;&nbsp;-")
  //       .replaceAll("\n", "<br />")
  //       .replaceAll("- ", "● ");
  //     output2.innerHTML = output;
  //   }
});

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return prompt("Copy to clipboard: Ctrl+C, Enter", text);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}
