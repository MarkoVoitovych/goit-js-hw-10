import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Countries from './classCountries';

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

    fetchCountries(countryName)
        .then(data => {
            if (data.length > 10) {
                clearMarkup();
                Notify.info('Too many matches found. Please enter a more specific name.');
                return '';
            }
            if (data.length > 1) {
                clearMarkup();
                const country = new Countries(data);
                country.renderListMarkup(refs.countryListEl);
                return '';
            }
            clearMarkup();
            const countries = new Countries(data);
            countries.renderCardMarkup(refs.countryCardEl);
        }).
        catch(error => {
            clearMarkup();
            Notify.failure(error);
        });
}

function clearMarkup() {
    refs.countryListEl.innerHTML = '';
    refs.countryCardEl.innerHTML = '';
}