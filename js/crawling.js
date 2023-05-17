const { Builder, By, Key, until } = require('selenium-webdriver'); //모듈 불러오기
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs'); // JSON 파일 작성 모듕

const titleList = [];
const imgSrcList = [];
let productsJson = [];

const url = 'https://m.kinolights.com/ranking/kino';
(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(url);
    await driver.executeScript(
      'window.scrollTo(0, document.body.scrollHeight);'
    );
    var products = await driver.findElements(By.className('rank'));
    console.log(products.length);

    for (i = 0; i < products.length; i++) {
      var img = await products[i].findElement(By.tagName('img'));
      var title = await products[i].findElement(By.className('title-text'));
      imgSrcList.push(await img.getAttribute('src'));
      titleList.push(await title.getText());

      await productsJson.push({
        title: titleList[titleList.length - 1],
        img: imgSrcList[imgSrcList.length - 1],
      });
    }
    console.log(productsJson);

    // 비동기처리방식 + json형식으로 저장
    fs.writeFile(
      './data/chart.json',
      JSON.stringify(productsJson),
      function (err) {
        console.log('FM 매치엔진 json파일 생성완료');
      }
    );
  } finally {
    // 가상 브라우저 종료
    await driver.quit();
  }
})();

// json파일을 List로 생성
let version_array = [
  {
    speed_scaler: '10000',
    very_slow_walk_speed: '4470',
    slow_walk_speed: '8940',
    walk_speed: '13410',
    fast_walk_speed: '17880',
  },
  {
    speed_scaler: '5000',
    very_slow_walk_speed: '1234',
    slow_walk_speed: '6666',
    walk_speed: '7777',
    fast_walk_speed: '23000',
  },
];
