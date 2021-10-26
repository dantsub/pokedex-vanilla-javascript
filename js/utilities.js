function capitalize(string) {
  return string[0].toUpperCase() + string.toLowerCase().slice(1);
}

async function getData(url) {
  if (!url) return;
  const data = await fetch(url);
  return await data.json();
}

export { capitalize, getData };
