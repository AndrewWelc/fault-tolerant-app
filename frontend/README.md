# Fault Tolerant App Frontend

This Angular application uses NGXS for state management and connects to a serverless backend for task processing and real-time updates. The frontend is built with Angular 15 and uses Angular Material for the UI components.

## 📋 Prerequisites

- **Node.js** (v14 or higher recommended)  
- **Angular CLI** (v15.2.x)  
  ```bash
  npm install -g @angular/cli@15.2.11
  ```

## Installation

1. Clone the repository and navigate to the `frontend` directory:
```bash
git clone https://github.com/AndrewWelc/fault-tolerant-app.git  
cd fault-tolerant-app/frontend
```
    
2. Install dependencies:
```bash
npm install
```

## 🔧 Configuration

The application requires configuration of backend endpoints. Create the following environment files:

1. `src/environments/environment.ts` for development:
```ts
export const environment = {
  production: false,
  apiUrl: 'https://<apiId>.execute-api.<region>.amazonaws.com/dev',
  websocketUrl: 'wss://<apiId>.execute-api.<region>.amazonaws.com/dev'
};
```

2. `src/environments/environment.prod.ts` for production with the same structure but production-specific URLs.

## 🛠️ Development Tools

The project uses:
- **Prettier** for code formatting
- **Jasmine** and **Karma** for testing
- **TypeScript** for type safety
- **Angular Material** for UI components
- **NGXS** for state management

## 🚀 Running the Application

Start the development server:
```bash
ng serve
```

Then open your browser at [http://localhost:4200](http://localhost:4200) to view the application.

## 🧪 Testing
To run the unit tests:
```bash
ng test
```

## 📦 Building for Production
To create a production build:
```bash
ng build --configuration production
```

## 🔄 Development Workflow

1. Make changes to the code
2. Run tests using `ng test`
3. Start development server with `ng serve`
4. Build for production using `ng build --configuration production`

## 🛠️ Troubleshooting

- Check **browser console** for runtime errors
- Verify **environment configuration** if encountering API connection issues
- Ensure all **dependencies** are properly installed
