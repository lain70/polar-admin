# polar-admin

Polar Bear Shop 관리자용 Vue 2 애플리케이션입니다.

## 실행

- `npm install`
- `npm start`: 로컬 개발 서버를 9001 포트에서 실행
- `npm run build`: 운영 번들 생성
- `npm run lint -- --no-fix`: ESLint 검사

API 주소와 서비스 키, 고객 화면 주소는 각각 `VUE_APP_API_BASE_URL`,
`VUE_APP_SERVICE_KEY`, `VUE_APP_CUSTOMER_BASE_URL` 환경변수로 설정합니다.
