# Fault Tolerant App Backend

This is the backend service for the Fault Tolerant Application, built using AWS Serverless technologies.

## 📋 Prerequisites

- **Node.js 18.x** or later
- **AWS CLI** configured with appropriate credentials
- **Serverless Framework v3** installed globally (`npm install -g serverless@3`)

## 📁 Project Structure

```
backend/
├── handlers/          # Lambda function handlers
├── scripts/          # Utility scripts
└── serverless.yml    # Serverless framework configuration
```

## ⚙️ Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Local Development:**
   - The application uses AWS services and is designed to run in the cloud
   - For local development, you can use AWS SAM Local or Serverless Offline
   - Note: Some features (like WebSocket connections) may require AWS deployment

## 🚀 Deployment

The application is deployed using the Serverless Framework. To deploy:

1. Ensure your AWS credentials are properly configured
2. Run the deployment command:
   ```bash
   npm run deploy
   ```

This will:
- Deploy all Lambda functions
- Create/update DynamoDB tables
- Set up SQS queues
- Configure API Gateway endpoints
- Update WebSocket endpoint

## 🔌 Available Endpoints

### HTTP API
- **POST /tasks** - Submit a new task
- **GET /tasks** - Retrieve all tasks

### WebSocket API
- **$connect** - Handle new WebSocket connections
- **$disconnect** - Handle WebSocket disconnections
- **$default** - Handle default WebSocket messages

## 🏗️ Infrastructure

The application uses the following AWS services:
- **AWS Lambda** for serverless compute
- **API Gateway** for HTTP and WebSocket APIs
- **DynamoDB** for data storage
- **SQS** for message queuing
- **IAM** for permissions management

## 🔄 Development Workflow

1. Make changes to the code
2. Test locally (if possible)
3. Deploy to AWS using `npm run deploy`
4. Verify the deployment in AWS Console

## 🛠️ Troubleshooting

- Check **CloudWatch logs** for Lambda function errors
- Verify **IAM permissions** if encountering access issues
- Check **API Gateway configuration** for endpoint issues
