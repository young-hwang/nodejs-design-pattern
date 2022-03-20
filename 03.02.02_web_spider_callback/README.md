This is an example of a simple web spider.
To run this example you need to:

1. install the dependencies with:
     npm install

2. download a website of your choice with
     node index_refactoring_0.js <url of the website to download>

## Callback 규칙

1. 가능한 빨리 종료 - return, continue 또는 break를 사용하여 if ... else 문(및 중첩)을 즉시 종료
2. Callback 을 위해 명명된 함수를 생성하여 클로저 바깥에 배치, 중간 결과를 인자로 전달
3. 코드를 모듈화 - 코드를 작고 재사용 가능한 함수로 분할

## Callback 규칙을 이용한 Refactoring

- index_refactoring_0 : web spider 원본 파일
- index_refactoring_1 : 가능한 빨리 종료를 위한 if ... else 구문 수정
- 