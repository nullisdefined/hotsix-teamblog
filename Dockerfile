# 빌드 스테이지
FROM node:16 AS builder

WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/
COPY apps/client/package*.json ./apps/client/
RUN npm install

# 소스 코드 복사
COPY . .

# 테스트 실행
# RUN npm run test

# 빌드
RUN npm run build

# 프로덕션 스테이지
FROM node:16-slim

WORKDIR /app

# 서버 빌드 결과물 복사
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/server/package*.json ./

# 클라이언트 빌드 결과물 복사 (필요한 경우)
COPY --from=builder /app/apps/client/dist ./public

# 설정 파일 복사
COPY --from=builder /app/apps/server/src/configs/superb-app-428715-m2-70554e73216e.json ./configs/

# 서버 실행
CMD ["npm", "run", "start:prod"]