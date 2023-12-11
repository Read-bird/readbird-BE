#기존 node 16버전의 이미지로부터 새로운 이미지 생성함을 지정
FROM node:16-alpine

#dockerfile을 생성/관리하는사람
MAINTAINER ReadBird <yuwang0130@gmail.com>

# 이미지내에 /app 디렉토리 생성
# 컨테이너 안에는 기본적으로 root권한으로 만들어짐
# 만일, 운영계정을 별도로 만들어 관리한다면 폴더 소유자 혹은 권한에 대한 설정도 해야됨.
RUN mkdir -p /app

# 이미지내의 /app 디렉토리를 WORKDIR 로 설정
WORKDIR /app

# 현재 Dockerfile 있는 경로의 모든 파일을 /app 에 복사
COPY ./ /app

# 실행하는 컨테이너 안에서 work dir에 있는 package.json을 기반으로 모듈 설치
RUN npm install

#환경변수 설정 : 운영 or 개발
ENV NODE_ENV production

# 컨테이너가 하게될 실행 명령 선언. 
# RUN은 이미지 빌드 중 실행. ENTRYPOINT 와 CMD는 이미지 빌드 후 컨테이너 실행시점에 살행
# ENTRYPOINT 와 CMD 차이점은, 
# ENTRYPOINT는 컨테이너가 수행될 때 반드시 지정한 명령을 수행되도록 지정
# CMD는 사용자가 입력하는 파라미터에 따라 변동가능
# 추후 두개의 명령어 테스트 필요
CMD ["npm","start"]