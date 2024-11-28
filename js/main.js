"use strict";

window.addEventListener("load", () => {
  const progressBar = document.querySelector(".progress");
  const loadingScreen = document.querySelector(".loading-page");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);

      // Hide loading screen with fade-out effect
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 400);
    }
  }, 20);
});

// media options list

const list = document.querySelector(".media-options ul");
let items = Array.from(list.children);
const liHeight = items[0].offsetHeight;
let isScrolling = false;

// Touch start position
let startY = 0;

// Touch end position
let endY = 0;

// Function to update the active class to the middle item
function updateActiveClass() {
  const middleIndex = Math.floor(items.length / 3);
  const activeOption = items[middleIndex];

  items.forEach((item) => item.classList.remove("active"));
  activeOption.classList.add("active");

  const optionNumber = activeOption.getAttribute("data-option");

  const contents = document.querySelectorAll(".media-content ul li");

  contents.forEach((content) => content.classList.remove("active"));

  const correspondingContent = document.querySelector(
    `.media-content ul li[data-content="${optionNumber}"]`
  );
  if (correspondingContent) {
    correspondingContent.classList.add("active");
  }

  const scrollTop =
    middleIndex * liHeight - list.offsetHeight / 2 + liHeight / 2;
  list.scrollTo({ top: scrollTop, behavior: "smooth" });
}

updateActiveClass();

// delay scroll handling
function handleScroll(direction) {
  if (isScrolling) return;
  isScrolling = true;

  if (direction === "down") {
    let first = items.shift();
    items.push(first);
  } else if (direction === "up") {
    let last = items.pop();
    items.unshift(last);
  }

  list.innerHTML = "";
  items.forEach((item) => list.appendChild(item));

  updateActiveClass();

  // delay timer 500 ms between each scroll
  setTimeout(() => (isScrolling = false), 500);
}

// Center item on click
items.forEach((item) => {
  item.addEventListener("click", () => {
    const clickedIndex = items.indexOf(item);
    const middleIndex = Math.floor(items.length / 3);
    const shifts = clickedIndex - middleIndex;

    if (shifts > 0) {
      for (let i = 0; i < shifts; i++) {
        let first = items.shift();
        items.push(first);
      }
    } else if (shifts < 0) {
      for (let i = 0; i < Math.abs(shifts); i++) {
        let last = items.pop();
        items.unshift(last);
      }
    }

    list.innerHTML = "";
    items.forEach((item) => list.appendChild(item));

    updateActiveClass();
  });
});

// Wheel event for mouse scroll
list.addEventListener("wheel", (event) => {
  event.preventDefault();

  if (event.deltaY > 0) {
    handleScroll("down");
  } else if (event.deltaY < 0) {
    handleScroll("up");
  }
});

// Touch support for mobile devices
list.addEventListener("touchstart", (event) => {
  startY = event.touches[0].clientY;
});

list.addEventListener("touchend", (event) => {
  endY = event.changedTouches[0].clientY;
  const deltaY = startY - endY;

  if (deltaY > 20) {
    handleScroll("down");
  } else if (deltaY < -20) {
    handleScroll("up");
  }
});

// media content buttons add and remove active class when click

let mediaBts = document.querySelectorAll(".media .media-content button");

mediaBts.forEach((btns) => {
  btns.addEventListener("click", function () {
    mediaBts.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
});
