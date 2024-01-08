<img src="https://capsule-render.vercel.app/api?type=venom&color=auto&height=250&section=header&text=readbird-be&fontSize=70&fontAlignY=38&desc=독서%20플래너%20서비스%20[읽어보새]&descAlignY=51&descAlign=57" />

<h1>소개</h1>
<p>
  한 달에 책 한 권 읽기도 힘들다면? 읽어보새와 함께 독서 습관을 만들어보세요! ➡️
  <a href="https://readbird.swygbro.com">ReadBird</a>
</p>
<ol>
  <li>매일 독서 분량을 배분해 끝까지 완독하는 독서 습관 형성</li>
  <li>성취도 체크를 통해 매일 더 읽거나 덜 읽은 분량을 남은 기간의 플랜에 반영</li>
  <li>플랜 성취도 통계, 주차별/월별 읽은 책 수 등 데이터 제공</li>
  <li>플랜 성공 시 캐릭터 획득</li>
  <li>추천 도서 큐레이션을 통한 독서 시작 유도</li>
</ol>

<h1>제작 기간 및 백엔드 팀 소개</h1>
<div>
  <p>제작 기간: 11/20 ~ 12/31</p>
  <p>backend-developer: 김혜란 ➡️ <a href="https://github.com/kimmand0o0">혜란'gitHub</a></p>
  <p>backend-developer: 이재승 ➡️ <a href="https://github.com/seungE95">재승'gitHub</a></p>
</div>

<h1>📚 Skill</h1>
	<div>
  	<img src="https://img.shields.io/badge/typescript-3178C6?style=flat&logo=typescript&logoColor=white" />
  	<img src="https://img.shields.io/badge/nodejs-339933?style=flat&logo=nodedotjs&logoColor=white" />
  	<img src="https://img.shields.io/badge/express-000000?style=flat&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/mysql-4479A1?style=flat&logo=mysql&logoColor=white" />
    <img src="https://img.shields.io/badge/sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white" />
    <img src="https://img.shields.io/badge/amazon rds-527FFF?style=flat&logo=amazonrds&logoColor=white" />
    <img src="https://img.shields.io/badge/jest-C21325?style=flat&logo=jest&logoColor=white" />
    <img src="https://img.shields.io/badge/swagger-85EA2D?style=flat&logo=swagger&logoColor=white" />
  </div>
  
<h1>🛠️ Tools</h1>
  <div>
  	<img src="https://img.shields.io/badge/visual studio code-007ACC?style=flat&logo=visualstudiocode&logoColor=white" />
  	<img src="https://img.shields.io/badge/postman-FF6C37?style=flat&logo=postman&logoColor=white" />
  	<img src="https://img.shields.io/badge/discord-5865F2?style=flat&logo=discord&logoColor=white" />
    <img src="https://img.shields.io/badge/google sheets-34A853?style=flat&logo=googlesheets&logoColor=white" />
  </div>

<h1>Trouble Shooting</h1>

[문제 1]
책 데이터를 DB에 저장하여 이용하려 하였으나, 알라딘의 검색 API에서 '검색어'가 필수로 필요함

[해결 1]
알라딘의 검색 API를 사용하고, 플랜 등록 시에 해당하는 책 정보만 저장함
그 과정에서 서버 자원또한 같이 절약

[문제 2]
알라딘의 검색과 총 페이지 수가 나뉘어 있어, API 일 호출 제한이 걸림

[해결 2]
로드밸런싱의 부하분산에서 착안해, 팀원들의 TTBKEY를 랜덤하게 사용하여 호출 가능 횟수를 늘림

![2](https://github.com/Read-bird/readbird-be/assets/77827700/7cf2d7d9-6b4b-41a5-b4e6-c0bf696b1a07)
![3](https://github.com/Read-bird/readbird-be/assets/77827700/6aa23f7a-eaf3-4639-9f3f-adfed94c430e)

[문제 3]
총 페이지 수 API가 string 값으로 넘어옴

[해결 3]
호출 query 수정과 JSON.parse()를 이용하였지만 해결되지 않아, indexOf()로 위치를 지정하여 페이지 수를 slice()하여 사용

![1](https://github.com/Read-bird/readbird-be/assets/77827700/c1e3a016-2111-43a3-9d32-e3a24644dece)


[문제 4]
단발성 이벤트 캐릭터가 있어 유저 마다의 얻을 수 있는 캐릭터 총 개수와 Id가 달라 while을 사용한 로직이 무한 루프를 돌며 서버가 죽는 현상이 생김

[해결 4]
기본 캐릭터에 대한 arr를 생성하여 filter()와 indexOf() 매서드를 함께 사용하여 해결
해결 과정에서 코드가 더욱 간결해지며 상수처리의 중요성을 알게됨

![4](https://github.com/Read-bird/readbird-be/assets/77827700/a497ac9f-95fa-4568-9559-f5ce8b99db1a)

[의사결정]
쌓이는 데이터가 중요한 서비스로 판단
데이터 삭제 방식을 조사한 후 논리삭제로 결정

[문제 5]
두개의 브라우저를 사용하여 로그인 한 후, A 브라우저에서 회원 탈퇴하였으나 B 브라우저에서 정상적으로 활동 가능한 문제

[해결 5]
인증 미들웨어에서 유저의 탈퇴여부를 확인 후 auth error를 내보냄

![5](https://github.com/Read-bird/readbird-be/assets/77827700/63bd7581-d73c-4f39-a361-0313e508b00e)

[문제 6]
회원탈퇴 시 unique : true인 email 중복값으로 인한 error

[해결 6]
A-z까지의 랜덤한 문자를 조합한 후 userId와 합친 문자열을 생성하여 email값으로 update하여 중복 가능성을 배제함

![6](https://github.com/Read-bird/readbird-be/assets/77827700/43a49809-5b1c-4f0e-88be-d80b1aba5c32)

[문제 7]
passport같은 라이브러리를 사용 시 유저의 마지막 페이지가 백엔드 서버에서 멈추게 됨
redirect로 url에 유저 데이터와 토큰을 넣어 프론트로 넘겨주는 과정에서 보안이 좋지 않다고 판단

[해결 7]
Rest API를 이용하여 프론트와 함께 작업
1차 kakao auto token을 프론트에서 받은 후 POST API를 이용하여 백엔드에게 요청을 보내 body와 headers를 통한 데이터 전달이 가능해짐

![7](https://github.com/Read-bird/readbird-be/assets/77827700/8dfa3cc2-d2a1-4e23-a880-f24c06b61072)

