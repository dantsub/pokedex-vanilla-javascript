import { capitalize } from './utilities.js';


const renderPokeList = async (pokedex, typeId=0) => {
  const container = document.querySelector('.js-container');
  const loader = document.querySelector('.js-loader');
  if (!container) return;

  let list;

  if (pokedex.filterTypeActive && typeId !== 0) {
      container.innerHTML = '';
      list = await pokedex.getPokemonsByType(typeId);
  }

  if (!pokedex.filterTypeActive) {
    if (pokedex.pagination === 0) {
      container.innerHTML = '';
      pokedex.pokemon = [];
    }
    list = await pokedex.getPokemons();
  }

  if (pokedex.filterSortActive) {
    container.innerHTML = '';
    list = pokedex.pokemon;
  }

  for (let elem of list) {
    container.innerHTML += templateCard(elem);
  }

  if (pokedex.filterTypeActive) {
    loader.style.display = 'none';
  }
}

const renderDetails = async (pokedex) => {
  const { location } = window;
  if (location.href.includes('index')) return;

  if (location.href.includes('pokemon')) {
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    const pokeId = parseInt(params.get('pokemon'), 10);

    if (pokeId < 1 || pokeId > 898 || pokeId === NaN) return;

    const pokemon = await pokedex.getPokemon(`${pokedex.baseApiUrl}/${pokeId}`);
    const tabStats = document.querySelector('.js-tab-stats');
    const tabAbilites = document.querySelector('.js-tab-abilities');
    const cardContainer = document.querySelector('.js-card-container');
    const { stats, abilities } = pokemon;

    cardContainer.innerHTML = templateCard(pokemon);

    let statsContent = '<h2 class="sr-only">Stats of pokemon</h2>';
    let abilitiesContent = '<h2 class="sr-only">Stats of pokemon</h2>';

    for (let stat in stats) {
      const width = (stats[stat] * 100) / 225;
      statsContent += templateStats({ stats, stat, width });
    }

    for (let ability in abilities) {
      abilitiesContent += templateAbilities({ abilities, ability });
    }

    tabStats.innerHTML = statsContent;
    tabAbilites.innerHTML = abilitiesContent;
  }
};

const cardRedirect = () => {
  const cardContainer = document.querySelector('.js-container');
  if (!cardContainer) return;
  cardContainer.addEventListener('click', (e) => {
    e.preventDefault();

    const { target } = e;
    const pokeId = target.dataset.id;

    if (pokeId) {
      window.location.href = `details.html?pokemon=${pokeId}`;
    }
  });
};

const renderListTypes = async (pokedex) => {
  const filter = document.querySelector('.js-filter-type');
  if (!filter) return;
  const [names, ids] = await pokedex.getListTypes();
  let template = '<li class="filter__item"><a class="filter__link" href="#">None</a></li>';

  for (let i in ids) {
    const name = names[i];
    const id = ids[i];
    template += templateTypeList({ id, name });
  }
  filter.innerHTML = template;
};

/* const renderPokemonByType = (pokedex) => {
  const pokeContainer = document.querySelector('.js-container');
  const loading = document.querySelector('.js-loader');
  loading.style.display = 'inline-block';
  pokeContainer.innerHTML = '';
  renderPokemon(pokedex);
  loading.style.display = 'none';
}; */

const templateTypeList = ({ id, name }) => {
  return `
  <li class="filter__item"><a class="filter__link" href="#" data-type-value="${id}">${capitalize(name)}</a></li>`;
};

const templateStats = ({ stats, stat, width }) => {
  return `
  <label class="progress-bar">
    <span class="progress-bar__title">${stat}</span>
    <div class="progress-bar__value" style="width:${width}%;"></div>
    <span>${stats[stat]}</span>
  </label>
  `;
};

const templateAbilities = ({ abilities, ability }) => {
  return `
  <section class="abilities">
    <h3 class="abilities__title">${capitalize(ability)}</h3>
    <p class="abilities__text">${abilities[ability]}</p>
  </section>
  `;
};

const templateCard = ({ id, name, sprite, types }) => {
  const [type1, type2] = types;

  return `
  <article class="card shadow ${type1}${!type2 ? '' : ' ' + type2}" data-id="${id}">
    <h6 class="sr-only">${name} card</h6>
    <section class="card__body">
      <img class="card__img" src="${sprite}" alt="${name} sprite">
      <h2 class="card__title">${capitalize(name)}<small class="card__num">#${('00' + id).slice(-3)}</small></h2>
    </section>
    <footer class="card__footer">
      <p class="card__type">${capitalize(type1)}</p>
      <p class="card__type card__type--right">${!type2 ? '' : capitalize(type2)}</p>
    </footer>
  </article>
  `;
};
export { renderListTypes, renderDetails, cardRedirect, renderPokeList };
