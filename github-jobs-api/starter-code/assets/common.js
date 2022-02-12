const jobWrap = document.querySelector(".jobs_wrap");
// const API = "https://cors.bridged.cc/https://jobs.github.com/positions.json";
const loadMore = document.querySelector("#loadMore");

let params = "";

const wherePage = window.location.href.includes("index.html")
  ? "main"
  : "details";

const getDetails = () => {
  const detailsId = window.location.href.split("?")[1];
  const detailsData = JSON.parse(localStorage.data).filter(
    (job) => job.id === Number(detailsId)
  )[0];
  console.log("detailsData", detailsData);
  document.querySelector(".details-logo").classList.remove("skeletone");
  document.querySelector(".details-logo").setAttribute(
    "src",
    // detailsData.logo ? detailsData.logo :
    "./assets/desktop/logo.svg"
  );
  document
    .querySelector(".details-title")
    .insertAdjacentText(
      "beforeend",
      detailsData.position ? detailsData.position : ""
    );
  document
    .querySelector(".details-company")
    .insertAdjacentText(
      "beforeend",
      detailsData.company ? detailsData.company : ""
    );
  document
    .querySelector(".job_detail")
    .insertAdjacentHTML("beforeend", detailsData.description);
  document
    .querySelector(".howTo")
    .insertAdjacentHTML(
      "beforeend",
      detailsData.how_to_apply ? detailsData.how_to_apply : ""
    );
};

const checkStatusAndParse = (res) => {
  if (!res.ok) throw new Error(`Status Code Error: ${res.status}`);
  return res.json();
};

let pages = [];
let nowPage = 0;

const pagination = (data) => {
  if (!localStorage.data) {
    localStorage.data = JSON.stringify(data);
  }
  for (let i = 0; i < data.length; i += 12) {
    pages.push(data.slice(i, i + 12));
  }
  templates();
};

const templates = () => {
  if (nowPage === 0) jobWrap.removeChild(document.querySelector(".job_inner"));
  const jobInner = document.createElement("div");
  jobInner.classList.add("job_inner");

  pages[nowPage].map((job) => {
    const jobTemplate = `<div class="job" data-id="${job.id}">
        <h2 class="job_logo"><img data-src="./desktop/logo.svg" src="${
          job.website + job.logo
        }" /></h2>
        <p class="dates">${moment(job.created_at).fromNow()} &#183; ${
      job.type
    }</p>
        <h3 class="title"><a href="./details.html?${job.id}">${
      job.position
    }</a></h3>
        <p class="company">${job.company}</p>
        <p class="location">${job.location}</p>
      </div>`;
    jobInner.insertAdjacentHTML("beforeend", jobTemplate);
  });
  if (pages.length - 1 === nowPage && pages[0].length <= 12) {
    loadMore.style.display = "none";
  }
  jobWrap.insertAdjacentElement("beforeend", jobInner);
};

// const fetchJobs = (url) => {
//   return fetch(url);
// };

const getData = () =>
  // fetchJobs(API + `?${params}`)
  fetch("./data.json", { mode: "no-cors" })
    .then(checkStatusAndParse)
    .then(pagination)
    .catch((e) => console.log(e));

if (!localStorage.data) {
  getData();
} else {
  wherePage === "main"
    ? pagination(JSON.parse(localStorage.data))
    : getDetails();
}

if (wherePage === "main") {
  loadMore.addEventListener("click", (e) => {
    nowPage += 1;
    templates();
  });

  const searchButton = document.querySelector("#searchButton");
  const searchInputValue = document.querySelector(".searchInput");
  const searchLocationValue = document.querySelector(".searchLocation");
  const searchFullTimeValue = document.querySelector("#full_time_only");

  searchButton.addEventListener("click", (e) => {
    console.log(e);
    e.stopPropagation();
    params = "";

    if (searchInputValue.value !== "") {
      params += `description=${searchInputValue.value}&`;
    }
    if (searchLocationValue.value !== "") {
      params += `location=${searchLocationValue.value}&`;
    }
    if (searchFullTimeValue.checked) {
      params += `full_time=${searchFullTimeValue.checked}`;
    }
    jobWrap.removeChild(document.querySelector(".job_inner"));
    nowPage = 0;
    pages = [];
    getData();
    // console.log("button event :  ", API);
  });
}

const isDarkMode = document.querySelector("#color_scheme");
const app = document.documentElement;

const colorTheme = () => {
  const userTheme = localStorage.lightMode;
  const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  let getUserTheme = userTheme ? userTheme : osTheme;

  localStorage.lightMode = getUserTheme === "dark" ? "light" : "dark";
  window.__THEME_MODE = getUserTheme;
  app.setAttribute("data-light-mode", getUserTheme);
};

colorTheme();
if (localStorage.lightMode === "dark") {
  document.querySelector("#color_scheme").checked = true;
}

isDarkMode.addEventListener("click", (e) => {
  colorTheme(isDarkMode.checked);
});
