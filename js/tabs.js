const handlerTabs = () => {
  const tabNav = document.querySelector('.js-tab');
  if (!tabNav) return;

  const tabContainer = document.querySelector('.js-tab-container');
  tabNav.addEventListener('click', (e) => {
    e.preventDefault();

    const { target } = e;
    const { children } = tabNav;
    const tabNavChildren = [...children];
    const tabNumber = target.dataset.tabId;
    const tabToActive = tabContainer.querySelector(
      `.tab__content[data-tab="${tabNumber}"]`
    );
    const tabContent = tabContainer.querySelectorAll('.tab__content');

    tabNavChildren.forEach((child) =>
      child.classList.remove('tab__item--is-active')
    );
    tabContent.forEach((child) =>
      child.classList.remove('tab__content--is-active')
    );

    target.classList.add('tab__item--is-active');
    tabToActive.classList.add('tab__content--is-active');
  });
}
export default handlerTabs;
