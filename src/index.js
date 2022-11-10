import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const refs = {
    searchInputEl: document.getElementById('search-box'),
    countryListEl: document.querySelector('.country-list'),
    countryCardEl: document.querySelector('.country-info'),
    DEBOUNCE_DELAY: 300,
};

refs.searchInputEl.addEventListener('input', debounce(onInputSearch, refs.DEBOUNCE_DELAY));

function onInputSearch(e) {
    const countryName = e.target.value.trim();

    if (countryName === '') {
        clearMarkup();
        return '';
    }

    fetchCountries(countryName).
        then(response => {
            if (!response.ok) {
                throw new Error('Oops, there is no country with that name');
            }
            return response.json();
        }).
        then(data => {
            if (data.length > 10) {
                clearMarkup();
                Notify.info('Too many matches found. Please enter a more specific name.');
                return '';
            }
            if (data.length > 1) {
                renderListMarkup([...data], refs.countryListEl);
                return '';
            }
            renderCardMarkup(data, refs.countryCardEl);
        }).
        catch(error => {
            clearMarkup();
            Notify.failure(error);
        });
}

function renderListMarkup(config, parent) {
    clearMarkup();
    const markup = config.map(item => `
    <li class="country-list_item">
    <img class="country-flag" width=40 height=40 src=${item.flags.svg}>
    <span class="country-name">${item.name.official}</span>
    </li>
    `).join('');
    parent.innerHTML = markup;
}

function renderCardMarkup(config, parent) {
    clearMarkup();
    const { name: { official },
        capital,
        population,
        flags: { svg: flagSrc },
        languages } = config[0];

    const markup = `
    <div class="country-list_item">
    <img class="country-flag" width=40 height=40 src=${flagSrc}>
    <span class="country-name">${official}</span>
    </div>
    <p class='country-info'>Capital: <span class='country-info__details'>${capital}</span></p>
    <p class='country-info'>Population: <span class='country-info__details'>${population}</span></p>
    <p class='country-info'>Languages: <span class='country-info__details'>${Object.values(languages)}</span></p>
    `;
    parent.innerHTML = markup;
}

function clearMarkup() {
    refs.countryListEl.innerHTML = '';
    refs.countryCardEl.innerHTML = '';
}