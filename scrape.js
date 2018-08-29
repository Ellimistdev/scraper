const Nightmare = require('nightmare');
const { writeFileSync } = require('fs');

const formatData = (data) => {
  const arr = data;
  const pattern = /\n/g;
  for (let i = 0; i < arr.length; i += 1) {
    arr[i] = arr[i].replace(pattern, ',');
  }
  return arr;
};

const getData = (url) => {
  const nightmare = Nightmare({ show: true });

  return nightmare
    .goto(url)
    .wait('.thumbnail')
    .evaluate(() => [...document.querySelectorAll('.thumbnail')]
      .map(el => el.innerText))
    .end()
    .then(data => formatData(data))
    .catch((error) => {
      console.error('Search failed:', error);
    });
};

const writeData = (filename, data) => {
  writeFileSync(`./${filename}.csv`, data.join('\n'), { encoding: 'utf8' });
};

const tablets = getData('https://www.webscraper.io/test-sites/e-commerce/allinone/computers/tablets');
const phones = getData('https://www.webscraper.io/test-sites/e-commerce/allinone/phones/touch');
const laptops = getData('https://www.webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

tablets.then(data => writeData('tablets', data))
  .catch(e => console.error(e));
phones.then(data => writeData('phones', data))
  .catch(e => console.error(e));
laptops.then(data => writeData('laptops', data))
  .catch(e => console.error(e));
