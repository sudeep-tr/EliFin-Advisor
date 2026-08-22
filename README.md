💰 EliFin
=========

AI-Powered Personal Finance & Wealth Management Platform
--------------------------------------------------------

**EliFin** is a full-stack AI-powered financial management platform that helps users **track expenses, manage budgets, monitor investments, and receive personalized financial insights** from an AI-powered advisor.

> **Track. Understand. Plan. Grow.** 📊💰

🌟 Why EliFin?
--------------

Managing personal finances can become complicated when expenses, budgets, investments, and financial goals are spread across different platforms.

**EliFin brings everything together in one place.**

Instead of simply showing financial data, EliFin uses AI to help users **understand their financial behavior and make more informed decisions.**

🚀 Key Features
---------------

### 🔐 Authentication

*   User registration and login
    
*   Secure password handling
    
*   JWT-based authentication
    
*   Protected routes and APIs
    

### 💸 Expense Tracking

*   Add and manage expenses
    
*   Categorize spending
    
*   Track spending patterns
    
*   View financial activity
    

### 📊 Budget Management

*   Create category-based budgets
    
*   Set spending limits
    
*   Monitor budget utilization
    
*   Identify excessive spending
    

### 📈 Investment Management

*   Add and manage investments
    
*   Track investment portfolio
    
*   View investment information
    
*   Receive AI-powered investment insights
    

### 🤖 AI Financial Advisor

EliFin's AI Advisor provides personalized financial insights based on the user's financial information.

It can help with:

*   💰 Spending analysis
    
*   📊 Budget recommendations
    
*   💵 Saving strategies
    
*   📈 Investment insights
    
*   🎯 Financial planning
    

### 📊 Financial Dashboard

A centralized dashboard provides a quick overview of:

*   Total expenses
    
*   Budget status
    
*   Investment information
    
*   Financial activity
    
*   AI-generated insights
    

🧠 AI-Powered Financial Intelligence
====================================

The AI Advisor is powered by **Groq AI** and is integrated with EliFin's backend.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User Financial Data          │          ▼  ┌────────────────────┐  │   EliFin Backend   │  └─────────┬──────────┘            │            ▼  ┌────────────────────┐  │     Groq AI        │  │ Financial Analysis │  └─────────┬──────────┘            │            ▼   Personalized Insights            │            ▼         User   `

The AI analyzes relevant financial information and generates recommendations designed to help users better understand their finances.

> ⚠️ **Disclaimer:** AI-generated insights are for educational and informational purposes only and should not be considered professional financial advice.

🛠️ Technology Stack
====================

Frontend
--------

TechnologyPurposeReact.jsUser interfaceJavaScriptApplication logicCSS3StylingAxiosAPI communicationReact RouterClient-side routing

Backend
-------

TechnologyPurposeNode.jsRuntime environmentExpress.jsBackend frameworkMongoDBDatabaseMongooseDatabase modelingJWTAuthenticationREST APIFrontend-backend communication

AI
--

TechnologyPurposeGroq APIAI financial advisor

Tools
-----

*   Visual Studio Code
    
*   Git & GitHub
    
*   MongoDB Atlas
    
*   Thunder Client
    
*   npm
    

🏗️ System Architecture
=======================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML                       `┌──────────────────┐                         │      USER        │                         └────────┬─────────┘                                  │                                  ▼                         ┌──────────────────┐                         │  React Frontend  │                         └────────┬─────────┘                                  │                             REST APIs                                  │                                  ▼                         ┌──────────────────┐                         │ Express + Node.js│                         └────────┬─────────┘                                  │                   ┌──────────────┼──────────────┐                   │              │              │                   ▼              ▼              ▼            ┌────────────┐ ┌────────────┐ ┌────────────┐            │  MongoDB   │ │    JWT     │ │  Groq AI   │            │   Atlas    │ │    Auth    │ │   Advisor  │            └────────────┘ └────────────┘ └────────────┘                                  │                                  ▼                         ┌──────────────────┐                         │ Financial Insights│                         └──────────────────┘`

📂 Project Structure
====================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   EliFin/  │  ├── frontend/  │   ├── public/  │   ├── src/  │   │   ├── components/  │   │   ├── pages/  │   │   ├── api/  │   │   ├── assets/  │   │   ├── App.jsx  │   │   └── main.jsx  │   │  │   ├── package.json  │   └── ...  │  ├── backend/  │   ├── controllers/  │   ├── middleware/  │   ├── models/  │   ├── routes/  │   ├── config/  │   ├── server.js  │   ├── package.json  │   └── .env  │  ├── README.md  └── .gitignore   `

⚙️ Installation & Setup
=======================

1️⃣ Clone the Repository
------------------------

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/YOUR_USERNAME/EliFin.git   `

Navigate into the project:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd EliFin   `

🔧 Backend Setup
================

Navigate to the backend:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd backend   `

Install dependencies:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

Create a .env file:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   PORT=5000  MONGO_URI=your_mongodb_connection_string  JWT_SECRET=your_jwt_secret  GROQ_API_KEY=your_groq_api_key   `

Start the backend:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

If nodemon is not configured:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm start   `

💻 Frontend Setup
=================

Open a new terminal.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   cd frontend   `

Install dependencies:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm install   `

Start the frontend:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   npm run dev   `

Open the local URL displayed by Vite in your browser.

🔑 Environment Variables
========================

The backend requires the following environment variables:

VariableDescriptionPORTBackend server portMONGO\_URIMongoDB Atlas connection stringJWT\_SECRETSecret used for JWT authenticationGROQ\_API\_KEYGroq API key

### 🔒 Important

**Never commit your .env file to GitHub.**

Add this to .gitignore:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   node_modules/  .env  dist/   `

🗄️ Database
============

EliFin uses **MongoDB Atlas** as its cloud database.

The application is organized around multiple financial data models, including:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   User   │   ├── Expenses   │   ├── Budgets   │   ├── Investments   │   └── Financial Data            │            ▼        AI Advisor   `

Mongoose is used to define schemas and interact with MongoDB.

🔄 Application Flow
===================

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   1. User registers/logs in                ↓  2. JWT authentication                ↓  3. User accesses dashboard                ↓  4. User records financial information                ↓  5. Data stored in MongoDB                ↓  6. AI Advisor analyzes relevant data                ↓  7. Personalized financial insights                ↓  8. User makes informed decisions   `

🎯 Project Objectives
=====================

EliFin aims to:

*   Simplify personal financial management
    
*   Help users understand their spending habits
    
*   Encourage better budgeting and saving
    
*   Provide investment tracking
    
*   Use AI to generate personalized financial insights
    
*   Bring multiple financial tools into one platform
    

🔮 Future Roadmap
=================

### Phase 1

*   User authentication
    
*   Expense management
    
*   Budget management
    
*   Investment management
    
*   AI financial advisor
    

### Phase 2

*   Advanced analytics
    
*   Interactive financial charts
    
*   Financial goal tracking
    
*   Notifications and alerts
    
*   AI chatbot
    

### Phase 3

*   Mobile application
    
*   Financial institution integrations
    
*   Automated transaction categorization
    
*   Advanced AI financial planning
    
*   Production deployment
    

🔐 Security
===========

EliFin follows basic security practices including:

*   JWT-based authentication
    
*   Protected API routes
    
*   Password hashing
    
*   Environment variables for sensitive credentials
    
*   MongoDB authentication
    
*   Server-side validation
    
*   Separation of frontend and backend
    

💡 What Makes EliFin Different?
===============================

Traditional finance applications often focus on **displaying financial information**.

EliFin focuses on turning that information into **actionable insights**.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML        `Financial Data                │                ▼          ┌───────────┐          │  EliFin   │          └─────┬─────┘                │                ▼           AI Analysis                │                ▼       Personalized Insights                │                ▼        Better Decisions 🎯`

👨‍💻 Development
=================

EliFin is built as a full-stack web application using the **MERN stack**, with AI capabilities integrated into the platform.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   React    +  Node.js    +  Express.js    +  MongoDB    +  Groq AI    =  EliFin 💰   `

🤝 Contributing
===============

Contributions are welcome!

To contribute:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   git clone https://github.com/YOUR_USERNAME/EliFin.git  cd EliFin  git checkout -b feature/your-feature  git add .  git commit -m "Add your feature"  git push origin feature/your-feature   `

Then open a Pull Request.

📜 License
==========

This project is developed for **educational and hackathon purposes**.

⭐ Show Your Support
===================

If you like **EliFin**, consider giving the repository a ⭐ on GitHub!

💰 EliFin
---------

### **Track. Understand. Plan. Grow.**

**AI-powered finance for smarter financial decisions. 🤖📊💰**
