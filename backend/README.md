# Fault Tolerant App Backend

This is the backend service for the Fault Tolerant Application, built using AWS Serverless technologies.

## 📋 Prerequisites

- **Node.js 18.x** or later
- **AWS CLI** configured with appropriate credentials
- **Serverless Framework v3** installed globally (`npm install -g serverless@3`)
- **Docker** installed and running (for local development)

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
   The application can be run locally using serverless-offline with Docker for DynamoDB. This setup provides a local environment that closely mirrors the AWS infrastructure.

   To start the local development environment:
   ```bash
   npm run start:with-db
   ```
   This will:
   - Start a local DynamoDB instance in Docker on port 8000
   - Start the serverless-offline server on port 4000
   - Start WebSocket support on port 4001
   - Start Lambda functions on port 4002

   Available endpoints:
   - HTTP API: `http://localhost:4000`
   - WebSocket: `ws://localhost:4001`

   To stop the local DynamoDB:
   ```bash
   npm run stop:db
   ```

   Note: While most features work locally, some AWS-specific features might require actual AWS deployment.

## 🔐 Bootstrap AWS IAM Permissions (One-Time Setup)

Before the first deployment, make sure your AWS user has the required permissions by creating and attaching the `CloudFormationAccessForServerless` policy.

### ✅ Option A: Run the Bootstrap Script (Easy)

If you're comfortable with the AWS CLI, run this one-liner:

```bash
./scripts/bootstrap-iam.sh
```

**This will:**
- Create the `CloudFormationAccessForServerless` IAM policy (if not already created)

- Attach it to your currently authenticated IAM user

- Enable permissions for deploying with Serverless

- Make sure you’ve already configured AWS CLI with the right credentials.

---

### 🛠️ Option B: Manual Setup via AWS Console

1. Open [IAM > Policies](https://console.aws.amazon.com/iam/home#/policies).
2. Click **Create policy**.
3. Choose the **JSON** tab.
4. Paste in the contents of [`policies/CloudFormationAccessForServerless.json`](policies/CloudFormationAccessForServerless.json).
5. Click **Next**, name the policy: `CloudFormationAccessForServerless`, and finish creation.
6. Go to **Users**, find your user, and **attach the policy**.

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

## 🧩 CORS Configuration

- CORS headers are managed centrally using a utility function: `utils/responseWithCors.js`
- This helper automatically injects CORS headers into all HTTP responses
- Origins and allowed headers are configurable via environment variables defined in `serverless.yml`:
```yaml
provider:
environment:
    CORS_ORIGINS: "http://localhost:4200"
    CORS_HEADERS: "Content-Type,X-Amz-Date,Authorization,X-Amz-Security-Token,X-Api-Key"
```
- All HTTP Lambda functions return responses with the correct CORS headers using the utility

## 🔄 Development Workflow

1. Make changes to the code
2. Test locally (if possible)
3. Deploy to AWS using `npm run deploy`
4. Verify the deployment in AWS Console

## 🛠️ Troubleshooting

- Check **CloudWatch logs** for Lambda function errors
- Verify **IAM permissions** if encountering access issues
- Check **API Gateway configuration** for endpoint issues
