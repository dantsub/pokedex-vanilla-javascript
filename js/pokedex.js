import { getData } from './utilities.js';

class Pokedex {
  constructor() {
    this.pokemon = [];
    this.baseApiUrl = 'https://pokeapi.co/api/v2/pokemon';
    this.apiUrl = `${this.baseApiUrl}?limit=20&offset=0`;
    this.sortAsc = true;
    this.sortSelected = '';
    this.filterSortActive = false;
    this.filterTypeActive = false;
    this.filterSort = { 'byName': this.sortByName.bind(this) , 'byId': this.sortById.bind(this) };
    this.pagination = 1;
    this.offset = 0;
    this.limit = 16;
    this.urlTypes = [];
  }

  async getPokemon(url) {
    const data = await getData(url);
    const pokemon = await this.#formatOne(data);
    return pokemon;
  }

  async getPokemons() {
    if (this.pagination === 0) {
      this.apiUrl = `${this.baseApiUrl}?limit=20&offset=0`;
      this.pokemon = [];
    }

    if (!this.apiUrl) return;

    const response = await getData(this.apiUrl);
    const collection = [];
    for (let pokemon of response.results) {
      let formatPokemon = await this.#formatPokemon(pokemon);
      collection.push(formatPokemon);
    }

    this.pokemon.push(...collection);
    this.apiUrl = response.next;
    this.pagination += 1;

    if (this.filterSortActive) {
      this.filterSort[this.sortSelected]();
    }

    return this.pokemon;
  }

  async getPokemonsByType(type) {
    const collection = [];
    const response = await getData(this.urlTypes[type - 1]);
    const pokemons = response.pokemon;
    for (let { pokemon } of pokemons) {
      let formatPokemon = await this.#formatPokemon(pokemon);
      collection.push(formatPokemon);
    }

    this.pokemon = [...collection];

    if (this.filterSortActive) {
      this.filterSort[this.sortSelected]();
    }

    return this.pokemon;
  }

  async getListTypes() {
    const url = 'https://pokeapi.co/api/v2/type';
    const { results } = await getData(url);
    const names = results.map((result) => result.name);
    const ids = results.map((result) => result.url.split('/').slice(-2)[0]);
    const urls = results.map((result) => result.url);

    this.urlTypes.push(...urls);

    return [names, ids];
  }

  sortByName() {
    if (this.sortAsc) {
      this.pokemon.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.pokemon.sort((a, b) => -a.name.localeCompare(b.name));
    }
  }

  sortById() {
    if (this.sortAsc) {
      this.pokemon.sort((a, b) => a.id - b.id);
    } else {
      this.pokemon.sort((a, b) => b.id - a.id);
    }
  }

  #formatTypes(types) {
    return types.map(({ type }) => type.name);
  }

  async #formatAbilities(abilities) {
    const newAbilities = {};

    for (let { ability } of abilities) {
      const { effect_entries } = await getData(ability.url);
      const description = effect_entries.map(entry => {
        if (entry.language.name === 'en') return entry.effect;
      }).join('');

      newAbilities[ability.name] = description;
    }

    return newAbilities;
  }

  #formatStats(stats) {
    const nameStats = [
      'HP',
      'Attack',
      'Defense',
      'Sp. Attack',
      'Sp. Defense',
      'Speed',
    ];
    const newStats = {};

    for (let stat in stats) {
      const name = nameStats[stat];
      const value = stats[stat].base_stat;
      newStats[name] = value;
    }

    return newStats;
  }

  async #formatOne(data) {
    let { id, name, abilities, sprites, types, stats } = data;
    const sprite = sprites.front_default;

    stats = this.#formatStats(stats);
    types = this.#formatTypes(types);
    abilities = await this.#formatAbilities(abilities);

    return { id, name, sprite, abilities, types, stats };
  }

  async #formatPokemon(response) {
    const { url, name } = response;
    let { id, sprites, types } = await getData(url);
    const sprite = sprites.front_default;
    types = this.#formatTypes(types);

    return { id, name, sprite, types };
  }

}

export default Pokedex;
