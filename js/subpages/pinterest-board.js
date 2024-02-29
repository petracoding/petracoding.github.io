const isLocal = window.location.hostname == "localhost";
const urlBase = isLocal ? "http://localhost:52330/pinterest/board.html" : "https://petracoding.github.io/pinterest/board.html";

document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".pinterest-board")) {
    buildURL();
    document.querySelector("#your-link").addEventListener("input", buildURL);
    document.querySelector("#hide-header").addEventListener("input", buildURL);
    document.querySelector("#transparent-bg").addEventListener("input", buildURL);
  }
});

function buildURL() {
  let url = urlBase;
  const link = document.querySelector("#your-link").value;
  if (!link) {
    document.querySelector(".output").value = "";
    document.querySelector(".outputNotion").value = "";
    document.querySelector("iframe").setAttribute("src", "");
  } else {
    url += "?link=" + cleanPinterestUrl(link);
    const hideHeader = document.querySelector("#hide-header").checked;
    url += "&hideHeader=" + (hideHeader ? "1" : "0");
    const transparent = document.querySelector("#transparent-bg").checked;
    url += "&transparent=" + (transparent ? "1" : "0");
    document.querySelector("iframe").setAttribute("src", url);

    const output = `<iframe src="${url}"></iframe>`;
    document.querySelector(".output").value = output;
    document.querySelector(".outputNotion").value = url;
  }
}

function cleanPinterestUrl(link) {
  const i = getPosition(link, "/", 3);
  return link.substr(i).substr(1);
}

function getPosition(string, subString, index) {
  return string.split(subString, index).join(subString).length;
}
