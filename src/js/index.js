import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix, { Notify, Report } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

Notify.init({
  position: 'center-top',
  showOnlyTheLastOne: true,
});

input.addEventListener('input', debounce(displayCountries, DEBOUNCE_DELAY));

function displayCountries(event) {
  event.preventDefault();
  const search = input.value;
  const trimmedSearch = search.trim();
  fetchCountries(trimmedSearch)
    .then(res => {
      if (res.length < 2) {
        console.log(res);
        if (res[0].name.common === `Russia`) {
          Report.failure(`FUCK PUTIN!!!`, ``);
          return;
        } else {
          renderInfo(res);
          return;
        }
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
      return `<li class="country-element list"><img class="flag" src="${flags.svg}" alt="country flag"></img><span class="country-description bold">${name.official}</span></li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
}

function renderInfo(data) {
  const markup = data
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-element info row">
        <div class="country-heading">
          <img class="flag-high" src="${flags.svg}" alt="country flag"></img>
            <h2 class="country-description">${name.official}</h2>
        </div>
      <ul>
      <li class="country-list"><span class="bold">Capital:  </span>${capital}</li>
      <li class="country-list"><span class="bold">Population:  </span>${population}</li>
      <li class="country-list"><span class="bold">Languages:  </span>${Object.values(
        languages
      )}</li>
      </ul>
      </div>`;
    })
    .join('');
  countryInfo.insertAdjacentHTML('beforeend', markup);
}

function clear() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
