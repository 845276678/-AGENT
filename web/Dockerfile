# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run gen || echo "skip gen" && npm run build

# Runtime stage
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Copy standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
# Expose port
EXPOSE 3000
CMD ["node", "server.js"]