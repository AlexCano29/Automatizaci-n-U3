FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json prisma/ ./
RUN npm ci

# Generar el cliente de Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]