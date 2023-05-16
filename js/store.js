fetch('http://127.0.0.1:8080/data/products.json')
  .then((response) => response.json())
  .then((data) => {
    // JSON 파일이 성공적으로 로드되었을 때 실행되는 함수
    // data 변수에는 JSON 데이터가 JavaScript 객체로 파싱되어 저장됩니다.
    data.forEach((item) => {
      localStorage.setItem(item.title, JSON.stringify(item));

      var temp = JSON.parse(localStorage.getItem(item.title));
      console.log(temp);
    });
  })
  .catch((error) => {
    // JSON 파일 로드에 실패했을 때 실행되는 함수
    console.log('JSON 파일 로드 실패', error);
  });
