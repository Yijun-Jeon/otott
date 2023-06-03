// 4개의 json data에 접근하여 해당 정보를 로컬 스토리지로 올리는 역할

// 작품 정보 저장
fetch('http://localhost:8080/data/products.json')
  .then((response) => response.json())
  .then((data) => {
    // JSON 파일이 성공적으로 로드되었을 때 실행되는 함수
    // data 변수에는 JSON 데이터가 JavaScript 객체로 파싱되어 저장
    data.forEach((item) => {
      localStorage.setItem(item.title, JSON.stringify(item));
    });
  })
  .catch((error) => {
    // JSON 파일 로드에 실패했을 때 실행되는 함수
    console.log('products.json loda fail: ', error);
  });

let domainList = [
  'total',
  'netflix',
  'tving',
  'wavve',
  'disney',
  'coupang',
  'watcha',
];

// 인기차트 정보 저장
fetch('http://localhost:8080/data/chart.json')
  .then((response) => response.json())
  .then((data) => {
    for (var i = 0; i < 7; i++) {
      var filteredData = data.filter(
        (data) => data['domain'] === domainList[i]
      );
      filteredData.forEach((item, index) => {
        localStorage.setItem(
          domainList[i] + '-' + (index + 1),
          JSON.stringify(item)
        );
      });
    }
  })
  .catch((error) => {
    // JSON 파일 로드에 실패했을 때 실행되는 함수
    console.log('chart.json load fail: ', error);
  });

let genreList = ['romance', 'comedy', 'horror', 'sf', 'history', 'family'];

// 장르별 차트 저장
fetch('http://localhost:8080/data/genre.json')
  .then((response) => response.json())
  .then((data) => {
    for (var i = 0; i < 6; i++) {
      var filteredData = data.filter((data) => data['domain'] === genreList[i]);
      filteredData.forEach((item, index) => {
        localStorage.setItem(
          genreList[i] + '-' + (index + 1),
          JSON.stringify(item)
        );
      });
    }
  })
  .catch((error) => {
    // JSON 파일 로드에 실패했을 때 실행되는 함수
    console.log('chart.json load fail: ', error);
  });

let editorList = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6'];

// 에디터 추천 픽 차트 저장
fetch('http://localhost:8080/data/editor.json')
  .then((response) => response.json())
  .then((data) => {
    for (var i = 0; i < 6; i++) {
      var filteredData = data.filter(
        (data) => data['domain'] === editorList[i]
      );
      filteredData.forEach((item, index) => {
        localStorage.setItem(
          editorList[i] + '-' + (index + 1),
          JSON.stringify(item)
        );
      });
    }
  })
  .catch((error) => {
    // JSON 파일 로드에 실패했을 때 실행되는 함수
    console.log('chart.json load fail: ', error);
  });
