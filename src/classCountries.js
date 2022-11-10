export default class Countries {
    constructor(data) {
        this.data = [...data];
    }

    renderCardMarkup(parent) {
        const {
            name: { official },
            capital,
            population,
            flags: { svg: flagSrc },
            languages,
        } = this.data[0];

        parent.innerHTML = `
            <div class="country-list_item">
            <img class="country-flag" width=40 height=40 src=${flagSrc}>
            <span class="country-name">${official}</span>
            </div>
            <p class='country-info'>Capital:
            <span class='country-info__details'>${capital}</span></p>
            <p class='country-info'>Population:
            <span class='country-info__details'>${population}</span></p>
            <p class='country-info'>Languages:
            <span class='country-info__details'>${Object.values(languages)}</span></p>
    `;
    }

    renderListMarkup(parent) {
        parent.innerHTML = this.data
            .map(
                ({
                    flags: { svg },
                    name: { official },
                }) => `
            <li class="country-list_item">
            <img class="country-flag" width=40 height=40 src=${svg}>
            <span class="country-name">${official}</span>
            </li>`)
            .join('');
    }
}