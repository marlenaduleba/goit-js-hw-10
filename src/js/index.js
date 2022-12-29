import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix, { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(displayCountries, DEBOUNCE_DELAY));

function displayCountries(event) {
    event.preventDefault();
    const search = input.value;
   fetchCountries(search)
   .then((res) => {
    renderInfo(res);
    console.log(res);
   })
   .catch((error) => {
    console.log(error);
   })
}

function renderList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="country flag"></img>${name.official}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderInfo(data) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
    return `<li><img src="${flags.svg}" alt="country flag"></img>${name.official}</li>
            <li>${capital}</li>
            <li>${population}</li>
            <li>${Object.values(languages)}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}
