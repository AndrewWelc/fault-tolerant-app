# Fault-Tolerant App

This repository contains a fault-tolerant, full-stack application built using a serverless architecture. The system simulates a data processing pipeline where users submit tasks via a frontend, and a robust backend processes these tasks asynchronously using AWS services. Real-time task status updates are provided via a WebSocket API.

## 📋 Table of Contents

- [Fault-Tolerant App](#fault-tolerant-app)
  - [📋 Table of Contents](#-table-of-contents)
  - [🌟 Overview](#-overview)
  - [🏗 Architecture](#-architecture)
  - [⚙️ Setup Instructions](#️-setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
    - [Local Development](#local-development)
  - [🧪 Testing Instructions](#-testing-instructions)
    - [Backend Testing](#backend-testing)
    - [Frontend Testing](#frontend-testing)
  - [🛠️ Assumptions \& Challenges](#️-assumptions--challenges)
    - [Assumptions](#assumptions)
    - [Challenges](#challenges)

## 🌟 Overview

The application is split into two main parts:

- **Frontend:** An Angular 15 application using NGXS for state management, which allows users to submit tasks and view live updates.
- **Backend:** A Node.js serverless application deployed using the Serverless Framework on AWS. It leverages AWS Lambda, API Gateway (REST and WebSocket), SQS, DynamoDB, and CloudWatch for logging and monitoring. Tasks are processed asynchronously with fault-tolerant retry logic and real-time updates pushed via a WebSocket API.

## 🏗 Architecture
**Architecture Diagram:**
```mermaid
graph TD
    subgraph Frontend[Frontend - Angular]
        UI[🌐 User Interface]
        WS[🔌 WebSocket Client]
    end

    subgraph Backend[Backend - Serverless]
        API[🚪 API Gateway]
        Lambda[⚡ Lambda Functions]
        DB[(🗄️ DynamoDB)]
        Queue[📬 SQS Queue]
        DLQ[⚠️ Dead Letter Queue]
    end

    UI -->|HTTP Requests| API
    UI -->|WebSocket| WS
    WS -->|Connect/Updates| API
    API --> Lambda
    Lambda --> DB
    Lambda --> Queue
    Queue --> Lambda
    Queue -->|Failed Tasks| DLQ
    DLQ --> Lambda

    style Frontend fill:#e3f2fd,stroke:#0d47a1,stroke-width:2px,color:#000000
    style Backend fill:#f1f8e9,stroke:#33691e,stroke-width:2px,color:#000000

    style UI fill:#bbdefb,stroke:#0d47a1,stroke-width:2px,color:#000000
    style WS fill:#bbdefb,stroke:#0d47a1,stroke-width:2px,color:#000000

    style API fill:#ffe0b2,stroke:#ef6c00,stroke-width:2px,color:#000000
    style Lambda fill:#fff9c4,stroke:#f9a825,stroke-width:2px,color:#000000
    style DB fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px,color:#000000
    style Queue fill:#d1c4e9,stroke:#673ab7,stroke-width:2px,color:#000000
    style DLQ fill:#ffcdd2,stroke:#c62828,stroke-width:2px,color:#000000
```
**Key Components:**

- **Frontend (Angular):**
  - Task submission form and dashboard.
  - Uses NGXS for state management.
  - Receives real-time task status updates via a WebSocket client.

- **Backend (Serverless):**
  - **AWS Lambda:** Executes functions for task submission, processing, and WebSocket connection management.
  - **AWS API Gateway (REST):** Exposes HTTP endpoints for task submission and fetching tasks.
  - **AWS SQS:** Buffers tasks for asynchronous processing.
  - **AWS SQS Dead Letter Queue (DLQ):** Handles failed tasks after multiple retries.
  - **AWS DynamoDB:** Stores task details and active WebSocket connection IDs.
  - **AWS API Gateway (WebSocket):** Provides real-time push updates to connected clients.
  - **CloudWatch:** Aggregates logs and monitors function performance.


**Supporting Infrastructure:**

- **AWS IAM (Identity and Access Management):**
  - Manages permissions and access control for all AWS services
  - Ensures secure communication between components
  - Controls resource access through role-based policies

- **AWS CloudFormation:**
  - Manages infrastructure as code
  - Handles stack deployment and updates
  - Maintains consistent environment configuration

- **Environment Configuration:**
  - Lambda environment variables for service configuration
  - WebSocket endpoint management
  - Service connection details

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- Serverless Framework v3
- Docker (for local development)
- Angular CLI (for frontend development)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. For deployment to AWS:
   ```bash
   npm run deploy
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```

### Local Development
The application can be run entirely locally for development purposes:

1. **Backend Local Setup:**
   ```bash
   cd backend
   npm run start:with-db
   ```
   This starts:
   - Local DynamoDB on port 8000
   - HTTP API on port 4000
   - WebSocket API on port 4001
   - Lambda functions on port 4002

2. **Frontend Local Setup:**
   ```bash
   cd frontend
   ng serve
   ```
   The frontend will be available at `http://localhost:4200`

3. **Stopping Local Services:**
   - To stop the backend services:
     ```bash
     cd backend
     npm run stop:db
     ```
   - To stop the frontend: Press Ctrl+C in the frontend terminal

Note: While most features work locally, some AWS-specific features might require actual AWS deployment.

## 🧪 Testing Instructions

### Backend Testing

### Frontend Testing

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Run tests:
   ```bash
   ng test
   ```
This will run your NGXS state tests and component tests.

## 🛠️ Assumptions & Challenges

### Assumptions

- **AWS Environment**
    
    We assume that AWS user roles and policies are configured correctly and securely for all services.

- **Real-Time Updates**
    
    I chose to implement a WebSocket API over polling. This decision was made because WebSockets provide instant updates to multiple users and scale more efficiently, especially when tasks are frequently updated or processed in real time.

- **Serverless Framework Version**
    
    We are using Serverless Framework v3 because v4 requires a proper login and license/account setup, which we assume is not available in our current environment.

- **Angular Version**
    
    We are using Angular version 15. Due to legacy peer dependency issues, a standard npm install required some adjustments.

- **Backend Implementation**
    
    I opted for plain Node.js as our backend handler to keep the implementation simple and focused on demonstrating fault-tolerance and serverless capabilities, rather than using a heavier framework.

### Challenges

- **CORS Configuration**
    
    I encountered CORS issues during development, which were resolved after careful configuration of API Gateway and Lambda responses.

- **Serverless Version Constraints**
    
    Downgrading to Serverless v3 was necessary due to licensing/login requirements in v4. This was a workaround to ensure a smooth deployment process.

- **Angular Peer Dependencies**
    Working with an older version of Angular (v15) introduced legacy peer dependency issues that required manual resolution for a successful installation.

