# Prequin-App
# Full-Stack Investor Dashboard

This is a full-stack application that displays investor and commitment data. The frontend is built with React, TypeScript, and Material-UI, and the backend is a FastAPI server in Python.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Python](https://www.python.org/downloads/) (v3.9 or higher) and `pip`

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Clone the Repository

First, clone the repository to your local machine:
```bash
git clone https://github.com/niravsanghadiya/Prequin-App.git
cd Prequin-App


Note: First run the backend app then run frontend app in new terminal.

1.Backend Setup

The backend server provides the data for the application.

# Navigate to the backend directory
cd backend

# Install the required Python packages
pip install fastapi uvicorn pandas SQLAlchemy

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Run the FastAPI server
uvicorn main:app --reload

Your backend should now be running at http://127.0.0.1:8000.

2.Frontend Setup
The frontend is a React application that displays the data. Open a new terminal window for this step.

# Navigate to the frontend directory
cd frontend

# Install the required npm packages
npm install

# Run the React development server
npm run dev



Your frontend should now be running and accessible at http://localhost:5173 
(or another port if 5173 is in use)


## System Architecture Diagram

```mermaid
graph TD
    subgraph "User's Device"
        User[👤 User] --> Browser[🌐 Web Browser]
    end

    subgraph "Client-Side (SPA)"
        Browser --> Frontend[React Frontend]
    end

    subgraph "Server-Side"
        Backend[FastAPI Backend API]
    end
    
    subgraph "Data Layer"
        DataSource[📄 data.csv]
    end

    Frontend -- "REST API (JSON)" --> Backend
    Backend -- "Reads Data" --> DataSource