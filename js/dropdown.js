const handleDropdown = () => {
  const filterContainer = document.querySelector('.js-filter-container');
  if (!filterContainer) return;
  filterContainer.addEventListener('click', (e) => {
    e.preventDefault();

    const { target } = e;
    if (target.nodeName != 'A') return;

    if (target.classList.contains('filter__name')) { 
      const icon = [...target.children][1];
      icon.classList.toggle('filter__icon--is-active');

      const filterList = target.parentElement.childNodes[3];
      const allFilters = filterContainer.querySelectorAll('.filter__list');

      allFilters.forEach((filter) => {
        if (filter != filterList) {
          filter.classList.remove('filter__list--is-active');
        }
      });

      filterList.classList.toggle('filter__list--is-active');
    }
  });
}
export default handleDropdown;
