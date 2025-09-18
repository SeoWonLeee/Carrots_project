# 📍 Carrots Backend

## 프로젝트 개요
- 당근즈는 지역 기반의 중고 거래 백엔드 서비스입니다.
- 상품 등록·검색·거래·채팅·알림을 통합 제공하여 사용자 경험을 강화했습니다.
- Docker Compose로 MySQL 환경을 손쉽게 구동하고, QueryDSL 기반 검색과 SSE 기반 알림으로 실시간성과 편의성을 확보했습니다.

<br/>

## 역할 및 책임
- 검색 API 설계 및 고도화
    - 다중 조건(QueryDSL) 검색을 구축하여 키워드, 가격, 카테고리, 재고 상태, 지역을 한 번에 처리할 수 있도록 했습니다.
- 실시간 알림 파이프라인 구현
    - 거래 완료 및 채팅 요청 이벤트를 실시간으로 전달하고, 안전한 리다이렉션과 읽음 처리 흐름을 보장했습니다.
- 검색 성능 안정화
    - 지역 문자열을 계층형 주소 객체로 변환하고, 잘못된 입력으로 인한 예외를 방지하는 로직을 도입했습니다.
 
<br/>

## 주요 기능
- 검색 & 필터링: QueryDSL 기반 다중 조건 검색, 지역 단위(시/구/동) 세분화 지원
- 검색 기록 관리: 사용자별 최근 검색어 10건 저장·조회 API 제공
- 실시간 알림: SSE 기반 거래·채팅 알림 전송, 안전한 URL 검증 및 읽음 처리
- 지역 데이터 제공: 계층형 지역 데이터 트리 구조 반환
- 상품 관리: 상품 CRUD, 관심 상품, 판매 상태 변경, 조회수 관리, 즐겨찾기 등 핵심 기능 제공

<br/>

## 기술 스택
- 언어/프레임워크: Java 17, Spring Boot 3.4, Spring Data JPA, QueryDSL, Spring Security, SSE
- 데이터베이스: MySQL, H2 (테스트)
- 프론트엔드: React 19, React Router, Redux Toolkit, Axios, Kakao Maps SDK
- 운영/도구: Docker Compose, Gradle, Swagger(OpenAPI), Jenkins, Jira, GitHub

<br/>

## 문제 해결 사례
- 다중 조건 검색 안정화: 파라미터를 안전하게 변환해 잘못된 입력으로 인한 오류를 방지했습니다.
- 지역 문자열 파싱 개선: “시/구/동” 규칙을 적용해 주소 불일치 문제를 해결했습니다.
- 실시간 알림 안정성 확보: 알림 클릭 시 사용자 검증 및 허용된 경로만 노출되도록 보안 로직을 강화했습니다.
- 알림 복구 지원: 이벤트를 영속화하여 연결 종료 후에도 알림을 복구할 수 있도록 했습니다.

<br/>

## 결과 및 성과
- 복합 조건 검색 구현으로 맞춤형 검색 경험을 제공했습니다.
- 검색 URL과 북마크 동기화를 통해 재방문 UX를 개선했습니다.
- 실시간 알림과 안전한 리다이렉션으로 거래 안정성과 사용자 만족도를 높였습니다.
- 백엔드/프론트엔드/데이터 모듈 분리로 확장성과 협업 기반을 마련했습니다.

<br/>

## 데이터 및 아키텍처 참고
- **ERD** <br/> 
  <img width="603" height="579" alt="Image" src="https://github.com/user-attachments/assets/7e0d2e13-cecc-4c17-9219-5f4aa0fd1ff7" />
  <br/>
  
- **서비스 아키텍처**
  <img width="1141" height="660" alt="Image" src="https://github.com/user-attachments/assets/27d5d993-d50b-4e28-8506-f332e54d8eed" />

<br/>

## 참고 링크
- GitHub 조직: https://github.com/Group6-Carrots/main_repo.git
- Jira 보드: https://qweqwerty12321-1733977276703.atlassian.net/jira/software/projects/KAN/boards/1?cloudId=42b71363-3ef4-4d06-b42a-4fdb7bb64d4a
