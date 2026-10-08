# =========================================================
# Multi-stage Dockerfile for Java 25 + React + Redux + RxJS Web App
# =========================================================

# Stage 1: Build Frontend (React 19 + Redux Toolkit + RxJS)
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Create output directory for Vite build target inside bff
RUN mkdir -p /app/bff/src/main/resources/static
RUN npm run build

# Stage 2: Build Java 25 Spring Boot BFF Application
FROM eclipse-temurin:25-jdk AS backend-builder
RUN apt-get update && apt-get install -y maven
WORKDIR /app
COPY pom.xml ./
COPY bff ./bff
# Copy compiled frontend static bundle from stage 1
COPY --from=frontend-builder /app/bff/src/main/resources/static ./bff/src/main/resources/static
# Package Spring Boot application JAR skipping frontend exec re-run
RUN mvn package -DskipTests -Dexec.skip=true

# Stage 3: Lightweight Runtime Container for Local Docker Desktop
FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=backend-builder /app/bff/target/bff-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-Dspring.classformat.ignore=true"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
