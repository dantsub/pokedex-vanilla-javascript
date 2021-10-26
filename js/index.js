import handlerTabs from './tabs.js';
import handleDropdown from './dropdown.js';
import Pokedex from './pokedex.js';
import { filterByType, filterById } from './filters.js';
import { renderListTypes, renderDetails, renderPokeList, cardRedirect } from './renders.js';

document.addEventListener('DOMContentLoaded', () => {
  const pokedex = new Pokedex();

  handlerTabs();
  handleDropdown();
  filterById(pokedex);
  filterByType(pokedex);
  renderDetails(pokedex);
  renderListTypes(pokedex);
  cardRedirect();

  let options = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  }

  function intersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !pokedex.filterTypeActive) {
        if (pokedex.pagination > 0) {
          renderPokeList(pokedex);
        }
      }
    });
  }

  const loader = document.querySelector('.js-loader');
  if (loader) {
    let observer = new IntersectionObserver(intersect, options);
    observer.observe(loader);
  }

  window.addEventListener('click', (e) => {
    if (!e.target.matches('.filter__name')) {
      const allFilters = document.querySelectorAll('.filter__list');
      const allIcons = document.querySelectorAll('.filter__icon');

      allFilters.forEach((filter) => {
        filter.classList.remove('filter__list--is-active');
      });

      allIcons.forEach((icon) => {
        icon.classList.remove('filter__icon--is-active');
      });
    }
  });

});
