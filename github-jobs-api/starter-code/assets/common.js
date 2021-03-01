const jobWrap = document.querySelector('.jobs_wrap');
const API = 'https://cors.bridged.cc/https://jobs.github.com/positions.json'
const loadMore = document.querySelector('#loadMore');

let params = '';

const checkStatusAndParse = res => {
  if(!res.ok) throw new Error(`Status Code Error: ${res.status}`);
  return res.json();
};

let pages = [];
let nowPage = 0;

const pagination = data => {
  for(let i = 0; i < data.length; i+=12) {
    pages.push(data.slice(i, i + 12));
  }
  templates();
};

const templates = () => {
  const jobInner = document.createElement('div');
  jobInner.classList.add('job_inner');

  pages[nowPage].map(job => {
    const jobTemplate = `<div class="job">
        <h2 class="job_logo"><img src="${job.company_logo}" /></h2>
        <p class="dates">${job.type}</p>
        <h3 class="title">${job.title}</h3>
        <p class="company">${job.company}</p>
        <p class="location">${job.location}</p>
      </div>`;
    jobInner.insertAdjacentHTML('beforeend', jobTemplate);
  });
  if (parseInt(pages.length/12) <= nowPage) {
    loadMore.style.display = 'none';
  }
  jobWrap.insertAdjacentElement('beforeend', jobInner);
};

const fetchJobs = (url) => {
  return fetch(url);
};

const getData = () => fetchJobs(API + `?${params}`)
    .then(checkStatusAndParse)
    .then(pagination)
    .catch(e => console.log(e));

getData();


loadMore.addEventListener('click', (e) => {
  nowPage += 1;
  templates();
});

const searchButton = document.querySelector('#searchButton');
const searchInputValue = document.querySelector('.searchInput');
const searchLocationValue = document.querySelector('.searchLocation');
const searchFullTimeValue = document.querySelector('#full_time_only');

searchButton.addEventListener('click', (e) => {
  e.stopPropagation();
  params = '';

  if (searchInputValue.value !== '') {
    params += `description=${searchInputValue.value}&`;
  };
  if (searchLocationValue.value !== '') {
    params += `location=${searchLocationValue.value}&`;
  };
  if (searchFullTimeValue.checked) {
    params += `full_time=${searchFullTimeValue.checked}`;
  };
  jobWrap.removeChild(document.querySelector('.job_inner'));
  nowPage = 0;
  pages = [];
  getData();
});

const isDarkMode = document.querySelector('#color_scheme');
const app = document.documentElement;

const colorTheme = () => {
  let userTheme = localStorage.lightMode;

  userTheme = userTheme === 'dark' ? 'light' : 'dark';
  localStorage.lightMode = userTheme;
  window.__THEME_MODE = userTheme;
  app.setAttribute("data-light-mode", userTheme);
};



colorTheme();
if(localStorage.lightMode === 'dark') {
  document.querySelector('#color_scheme').checked = true;
}

isDarkMode.addEventListener('click', (e) => {
  colorTheme(isDarkMode.checked);
});
