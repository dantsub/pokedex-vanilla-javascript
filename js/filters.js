import { renderPokeList, renderPokemonByType, renderPokemonSorted } from "./renders.js";

const filterByType = (pokedex) => {
  const filterContainer = document.querySelector('.js-filter-type');
  const loader = document.querySelector('.js-loader');
  if (!filterContainer) return;

  filterContainer.addEventListener('click', (e) => {
    const { target } = e;
    let typeId = target.dataset.typeValue;

    pokedex.filterTypeActive = true;

    if (!typeId) {
      pokedex.filterTypeActive = false;
      typeId = 0;
      pokedex.pagination = 0;
      loader.style.display = 'inline-block';
    }

    renderPokemonByType(pokedex, typeId);
  });
}

const filterById = (pokedex) => {
  const filterContainer = document.querySelector('.js-filter-sort');
  if (!filterContainer) return;

  const sortOrder = { 'asc': true, 'desc': false};
  filterContainer.addEventListener('click', (e) => {
    const { target } = e;
    const order = target.dataset.sortOrder;
    const by = target.dataset.sortBy;

    pokedex.filterSortActive = true;
    pokedex.sortSelected = by;
    pokedex.sortAsc = sortOrder[order];
    pokedex.filterSort[by]();
    renderPokemonSorted(pokedex);
  });
}

export { filterByType, filterById };
