const rssConfig = require('../../config.json')
const rssList = rssConfig.sources
const striptags = require('striptags')

function foundFilterWords(filterType, content) {
  if (content == null) return false;
  var content = content.toLowerCase();
  if (filterType != null && filterType.length !== 0) {
    if (typeof filterType == "object") {
      for (var word in filterType)
        if (content.search(filterType[word].toLowerCase()) !== -1)
          return true;
    }
    else if (typeof filterType == "string") {
      if (content.search(filterType.toLowerCase()) !== -1)
        return true;
    }
  }
  else return false;
}


module.exports = function (rssIndex, data, dataDescrip) {

  var filterFound = false

  let titleFilters = rssList[rssIndex].filters.title;
  if (foundFilterWords(titleFilters, data.title))
    filterFound = true;

  let descrFilters = rssList[rssIndex].filters.description;
  if (foundFilterWords(descrFilters, dataDescrip))
    filterFound = true;

  let smryFilters = rssList[rssIndex].filters.summary;
  if (foundFilterWords(smryFilters, striptags(data.summary)))
    filterFound = true;

  if (data.guid.includes("yt")) {
    if (foundFilterWords(descrFilters, data['media:group']['media:description']['#']))
      filterFound = true;
  }

  return filterFound;

}