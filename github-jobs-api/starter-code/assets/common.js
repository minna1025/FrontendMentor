const jobWrap = document.querySelector('.jobs_wrap');
const API = 'https://cors.bridged.cc/https://jobs.github.com/positions.json'
const loadMore = document.querySelector('#loadMore');

let params = '';

const wherePage = window.location.href.includes('index.html') ? 'main' : 'details';

const getDetails = () => {
  const detailsId = window.location.href.split('?')[1];
  const detailsData = JSON.parse(localStorage.data).filter(job => job.id === detailsId)[0]
  document.querySelector('.details-logo').classList.remove('skeletone');
  document.querySelector(".details-logo").setAttribute('src', detailsData.company_logo ? detailsData.company_logo : './assets/desktop/logo.svg');
  document.querySelector('.details-title').insertAdjacentText('beforeend', detailsData.title ? detailsData.title : '');
  document.querySelector('.details-company').insertAdjacentText('beforeend', detailsData.company ? detailsData.company : '');
  document.querySelector('.job_detail').insertAdjacentHTML('beforeend', detailsData.description);
  document.querySelector('.howTo').insertAdjacentHTML('beforeend', detailsData.how_to_apply ? detailsData.how_to_apply : '');
}

const checkStatusAndParse = res => {
  if(!res.ok) throw new Error(`Status Code Error: ${res.status}`);
  return res.json();
};

let pages = [];
let nowPage = 0;

const pagination = data => {
  if (!localStorage.data) {
    localStorage.data = JSON.stringify(data);
  }
  for(let i = 0; i < data.length; i+=12) {
    pages.push(data.slice(i, i + 12));
  }
  templates();
};

const templates = () => {
  jobWrap.removeChild(document.querySelector('.job_inner'));
  const jobInner = document.createElement('div');
  jobInner.classList.add('job_inner');

  pages[nowPage].map(job => {
    const jobTemplate = `<div class="job" data-id="${job.id}">
        <h2 class="job_logo"><img data-src="./desktop/logo.svg" src="${job.company_logo}" /></h2>
        <p class="dates">${moment(job.created_at).fromNow()} &#183; ${job.type}</p>
        <h3 class="title"><a href="./details.html?${job.id}">${job.title}</a></h3>
        <p class="company">${job.company}</p>
        <p class="location">${job.location}</p>
      </div>`;
    jobInner.insertAdjacentHTML('beforeend', jobTemplate);
  });
  if (pages.length - 1 === nowPage && pages[0].length <= 12) {
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

if (!localStorage.data) {
  getData();
} else {
  wherePage === 'main' ? pagination(JSON.parse(localStorage.data)) : getDetails();
}

if(wherePage === 'main') {
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
}

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
