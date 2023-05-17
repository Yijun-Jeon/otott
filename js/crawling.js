const { Builder, By, Key, until } = require('selenium-webdriver'); //모듈 불러오기
const chrome = require('selenium-webdriver/chrome');

const url = 'https://m.kinolights.com/ranking/kino';

(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build(); //가상 브라우저 빌드
  try {
    await driver.get(url);
    var title = await driver.findElements(By.className('title-text'));

    // 첫 번째 요소 제거
    title.shift();

    console.log(title.length);
    for (i = 0; i < title.length; i++) {
      console.log(await title[i].getText());
    }
  } finally {
    await driver.quit(); //가상 브라우저를 종료시킨다
  }
})();
