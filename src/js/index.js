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
  const trimmedSearch = search.trim();
  fetchCountries(trimmedSearch)
    .then(res => {
      if (res.length < 2) {
        renderInfo(res);
        return;
      } else if (res.length >= 2 && res.length <= 10) {
        renderList(res);
        return;
      } else if (res.innerHTML === '') {
        clear();
        return;
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
    })
    .catch(error => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
      return;
    });
  clear();
}

function renderList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="country flag"></img> ${name.official}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderInfo(data) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<li><img src="${flags.svg}" alt="country flag"></img> ${
        name.official
      }</li>
            <li>Capital: ${capital}</li>
            <li>Population: ${population}</li>
            <li>Languages: ${Object.values(languages)}</li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function clear() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
