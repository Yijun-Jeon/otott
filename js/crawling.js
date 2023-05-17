const { Builder, By, Key, until } = require('selenium-webdriver'); //모듈 불러오기
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs'); // JSON 파일 작성 모듕

let productsJson = [];

const url = 'https://m.kinolights.com/ranking/kino';
(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(url);
    // lazy load 방지 하단 스크롤
    await driver.executeScript(
      'window.scrollTo(0, document.body.scrollHeight);'
    );
    // 1~20위 차트 li 목록
    var products = await driver.findElements(By.className('rank'));
    console.log(products.length);

    for (i = 0; i < products.length; i++) {
      var imgTag = await products[i].findElement(By.tagName('img'));
      var titleTag = await products[i].findElement(By.className('title-text'));

      var imgSrc = await imgTag.getAttribute('src');
      var titleTxt = await titleTag.getText();

      await productsJson.push({
        title: titleTxt,
        imgSrc: imgSrc,
      });
    }
    // console.log(productsJson);

    // 추출한 차트 목록 json으로 작성
    fs.writeFile(
      './data/chart.json',
      JSON.stringify(productsJson),
      function (err) {
        console.log('실시간 통합 차트 json 파일 생성 완료');
      }
    );
  } finally {
    // 가상 브라우저 종료
    await driver.quit();
  }
})();
