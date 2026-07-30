# VedaAI

This project consists of three main services: Frontend, Backend, and AI Service. 

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via MongoDB Atlas)
- PostgreSQL (Running locally)
- Neo4j & ChromaDB (For AI Service)

## Local Development Setup

To run the project locally without Docker, follow the instructions below for each service.

### 1. Frontend
The frontend is a Next.js application.

```bash
cd frontend
npm install
npm run dev
```
Access the frontend at http://localhost:3000

### 2. Backend
The backend is a Node.js/Express application.

```bash
cd backend
npm install
npm run dev
```
The backend will run on port 5000.

### 3. AI Service
The AI Service handles the AI agents, debate graphs, and vision scanning.
*(Note: Although typical AI services use Python, this service is built with Node.js/TypeScript using Langchain JS).*

```bash
cd ai
npm install
npm run dev
```
The AI service will run on port 5001.

---

## Environment Variables
Ensure you have the appropriate `.env` files created in each directory:
- `frontend/.env.local`
- `backend/.env`
- `ai/.env`
- Root `.env` (if applicable)

Populate these files with your respective API keys (e.g., OpenAI, Gemini, MongoDB URI).
