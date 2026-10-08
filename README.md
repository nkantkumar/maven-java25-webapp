# 🚀 Java 25 Maven Web Application (React + Redux + RxJS)

[![Java 25](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.org/projects/jdk/25/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.6-purple.svg)](https://redux-toolkit.js.org/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-b7178c.svg)](https://rxjs.dev/)
[![Docker Desktop](https://img.shields.io/badge/Docker-Desktop-blue.svg)](https://www.docker.com/products/docker-desktop/)

A modern, high-performance web application powered by **Java 25 (OpenJDK)**, **Spring Boot 3.4**, and a reactive single-page frontend built with **React 19**, **Redux Toolkit**, and **RxJS 7**. The application is containerized using multi-stage builds and is ready to deploy directly to **Docker Desktop**.

---

## 🌟 Key Features

- **⚡ Java 25 Virtual Threads & Runtime Diagnostics**: Live inspection of JVM version, CPU cores, active Garbage Collectors, heap memory usage, and Virtual Threads execution status (`Executors.newVirtualThreadPerTaskExecutor()`).
- **🚀 Concurrency Benchmark**: Interactive benchmark tool simulating thousands of concurrent lightweight virtual thread tasks with customizable I/O delay and live throughput calculations.
- **🔮 Interactive Java 25 Feature Inspector**: Live runtime evaluation and code view of cutting-edge Java 25 feature proposals (Structured Concurrency, Flexible Constructor Bodies, Primitive Types in Patterns, Implicitly Declared Classes, Compact Number Formatting).
- **⚛️ React 19 + Redux Toolkit + RxJS 7 Architecture**:
  - **React 19**: Modern UI component layout with glassmorphism visual styling, dark mode theme, progress indicators, and interactive code terminals.
  - **Redux Toolkit**: Centralized state management across modular slices (`jvmSlice`, `featuresSlice`, `benchmarkSlice`, `reactiveSlice`).
  - **RxJS 7**: Reactive data stream layer handling auto-polling intervals (`BehaviorSubject`), request pipelines (`switchMap`), real-time event log emissions, and error handling.
- **🐳 Docker Desktop Containerization**: Multi-stage `Dockerfile` and `docker-compose.yml` for single-command containerized local deployment.

---

## 🏗️ Architecture & Technology Stack

```
           +-------------------------------------------------------------+
           |                 React 19 Dashboard UI                       |
           +------------------------------+------------------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
              +---------v----------+              +---------v----------+
              | Redux Toolkit      |              | RxJS 7 Observables |
              | State Slices       |<-------------| Event Streams      |
              +---------+----------+              +---------+----------+
                        |                                   |
                        +-----------------+-----------------+
                                          | REST API (JSON)
                                          v
           +-------------------------------------------------------------+
           |                 Spring Boot 3.4 Backend                       |
           |             DashboardApiController (/api/*)                 |
           +------------------------------+------------------------------+
                                          |
                                 +--------v--------+
                                 | OpenJDK JVM 25  |
                                 | Virtual Threads |
                                 +-----------------+
```

### Backend (Java 25 & Spring Boot 3.4)
- **Language**: Java 25 (OpenJDK)
- **Framework**: Spring Boot 3.4.3 (`spring-boot-starter-web`, `spring-boot-starter-actuator`)
- **Build Tool**: Apache Maven 3.9+

### Frontend (React + Redux + RxJS)
- **UI Library**: React 19
- **State Management**: Redux Toolkit 2.6 (`@reduxjs/toolkit`, `react-redux`)
- **Reactive Streams**: RxJS 7.8 (`BehaviorSubject`, `Subject`, `switchMap`, `timer`, `catchError`)
- **Icons & Typography**: Lucide React, Plus Jakarta Sans, JetBrains Mono
- **Bundler**: Vite 6

---

## 📡 REST API Reference

The backend exposes the following REST API endpoints:

| HTTP Method | Endpoint | Description | Query Parameters | Response |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/jvm` | Fetches live JVM diagnostics and runtime statistics | None | `JvmInfo` JSON |
| `GET` | `/api/features` | Returns interactive Java 25 language feature demos | None | `List<FeatureDemoResult>` JSON |
| `POST` | `/api/benchmark/virtual-threads` | Runs high-concurrency Virtual Thread benchmark | `taskCount` (default: 1000), `delayMs` (default: 20) | Benchmark execution metrics JSON |

### Sample `GET /api/jvm` Response
```json
{
  "javaVersion": "25.0.3",
  "javaVendor": "Temurin",
  "osName": "Mac OS X",
  "osArch": "aarch64",
  "availableProcessors": 8,
  "usedMemoryMb": 54,
  "totalMemoryMb": 128,
  "maxMemoryMb": 4096,
  "isVirtualThreadSupportActive": true,
  "activeGarbageCollectors": ["G1 Young Generation", "G1 Old Generation"]
}
```

---

## 🛠️ Local Development Guide

### Prerequisites
- **Java 25** JDK installed and configured (`JAVA_HOME` set)
- **Apache Maven 3.9+**
- **Node.js 18+ & npm**
- **Docker Desktop** (for containerized deployment)

### Option 1: Full Maven Build & Single Jar Execution
1. Clone the repository and navigate to the project directory:
   ```bash
   cd maven-java25-webapp
   ```
2. Build the entire application (frontend + backend JAR):
   ```bash
   mvn clean package
   ```
   *Note: Maven will automatically run `npm install` and `npm run build` inside `frontend/` via `exec-maven-plugin` and copy the bundled static assets into `src/main/resources/static`.*

3. Run the Spring Boot JAR:
   ```bash
   java -Dspring.classformat.ignore=true -jar target/maven-java25-webapp-1.0.0-SNAPSHOT.jar
   ```
4. Access the React dashboard in your browser at `http://localhost:8080`.

### Option 2: Standalone Frontend Development Server
For rapid React frontend iteration with Hot Module Replacement (HMR):
1. Start the Spring Boot backend on port 8080:
   ```bash
   mvn spring-boot:run
   ```
2. In a separate terminal window, start Vite dev server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:3000` (Vite will proxy `/api` requests to Spring Boot at `http://localhost:8080`).

---

## 🐳 Deploying to Local Docker Desktop

The application includes a multi-stage `Dockerfile` and `docker-compose.yml` optimized for Docker Desktop.

### Method 1: Using Docker Compose (Recommended)
1. Ensure **Docker Desktop** is running.
2. Launch the containerized web app:
   ```bash
   docker compose up --build
   ```
3. Open `http://localhost:8080` in your web browser.
4. To stop the container:
   ```bash
   docker compose down
   ```

### Method 2: Using Docker CLI
1. Build the multi-stage Docker image:
   ```bash
   docker build -t maven-java25-webapp:latest .
   ```
2. Run the container:
   ```bash
   docker run -d -p 8080:8080 --name java25-app maven-java25-webapp:latest
   ```
3. Check container logs:
   ```bash
   docker logs -f java25-app
   ```

---

## 🧪 Testing

Run Spring Boot JUnit 5 integration tests:
```bash
mvn test
```

---

## 📄 License
This project is open-source under the MIT License.
