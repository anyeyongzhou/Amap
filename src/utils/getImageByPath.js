//const getImageUrl = (name) => new URL(`../${name}`, import.meta.url).href

function getImageUrl(name) {
  return new URL(`/src/assets/${name}`, import.meta.url).href
}

export default getImageUrl
