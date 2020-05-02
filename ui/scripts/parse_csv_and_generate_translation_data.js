const fs = require('fs');
const parse = require('csv-parse');
const srcFilePath = './meditranslate_consolidated.csv';

const languageNameInEnglishList = [];
const languageNameInNativeList = [];
const languageCodeList = [];
const translationKeyCategoryMap = {};
const translationKeyGroupByCategory = {};
const translationKeyList = [];
const categoryList = [];
const translationData = [];

// Keep track of the current row index.
let rowIndex = -1;

fs.createReadStream(srcFilePath)
  .pipe(parse())
  .on('data', row => {
    rowIndex++;

    // console.log(row);

    if (rowIndex === 0) {
      const [_, ...englishNames] = row;
      languageNameInEnglishList.push(...englishNames);
      return;
    }

    if (rowIndex === 1) {
      const [_, ...nativeNames] = row;
      languageNameInNativeList.push(...nativeNames);
      return;
    }

    if (rowIndex === 2) {
      const [_, ...codes] = row;
      languageCodeList.push(...codes);
      return;
    }

    const [category, ...data] = row;
    const translationKey = data[0];

    if (!translationKeyGroupByCategory[category]) {
      translationKeyGroupByCategory[category] = [];
    }

    translationKeyGroupByCategory[category].push(translationKey);
    translationKeyList.push(translationKey);
    translationKeyCategoryMap[translationKey] = category;
    translationData.push(data);
  })
  .on('end',() => {
    const categories = Object.keys(translationKeyGroupByCategory);
    // make the category list unique
    categoryList.push([...new Set(categories)]);

    // @TODO: generate necessary data file in js so that application can access
    // e.g. category list, language list.
    console.log("languageEnglishNameList:", languageNameInEnglishList);
    console.log("languageNativeNameList:", languageNameInNativeList);
    console.log("languageCodeList:", languageCodeList);
    console.log("translationKeyList:", translationKeyList);
    console.log("translationKeyCategoryMap:", translationKeyCategoryMap);
    console.log("translationKeyGroupByCategory:", translationKeyGroupByCategory);
    console.log("categoryList:", categoryList);
    console.log("translationData:", translationData);

    generateTranslationFiles(languageCodeList, translationKeyList, translationData);
  })
  .on('error', error => {
    console.log("Error:", error);
  });

const generateTranslationFiles = (languageCodeList, translationKeyList, translationData) => {
  const translationDataByLanguage = transpose(translationData);

  if (translationDataByLanguage.length !== languageCodeList.length) {
    console.warn('Expected translationDataByLanguage and languageCodeList to have the same length but is not, abort. translationDataByLanguage.length:', translationDataByLanguage.length, 'languageCodeList.length:', languageCodeList.length);
    return;
  }

  translationDataByLanguage.forEach((translationData, translationDataIndex) => {
    const langCode = languageCodeList[translationDataIndex];
    const output = {};

    translationData.forEach((translatedText, index) => {
      const translationKey = translationKeyList[index];

      if (!translationKey) {
        console.log('Unable to find translationKey for langCode:', langCode, 'index: ', index);
        return;
      }

      output[translationKey] = translatedText;
    })

    // console.log("langCode, output:", langCode, output);

    const destFilePath = `../src/data/lang/${langCode}.js`;
    fs.writeFile(destFilePath,
      'export default ' + JSON.stringify(output, null, 2),
      error => {
      if (error) {
        console.error(error);
        return;
      }

      console.log(`Successfully written to ${destFilePath}`);
    });
  });
}

/**
 * Transpose a 2D array.
 * e.g. convert
 * |1 2 3|
 * |4 5 6|
 * |7 8 9|
 * to
 * |1 4 7|
 * |2 5 8|
 * |3 6 9|
 * @param array
 * @returns {*[]}
 *
 * @ref https://stackoverflow.com/a/13241545/11560579
 */
const transpose = (array) => {
  return Object.keys(array[0]).map(function(c) {
    return array.map(function(r) { return r[c]; });
  });
}
