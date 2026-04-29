# KUB Portal — Energi Chatbot Documentation

**Author:** Kevin Lam

---

## Overview

This directory powers **Energi**, the Knoxville Utilities Board (KUB) customer service chatbot for KUB Portal Group B. It contains three scripts that together build and serve a Retrieval-Augmented Generation (RAG) pipeline:

| File       | Purpose                                       |
| ---------- | --------------------------------------------- |
| `embed.py` | Embeds FAQ data and stores it in the database |
| `rag.py`   | FastAPI server that handles chat requests     |
| `test.py`  | Tests the FastAPI server                      |

---

## Prerequisites

- [Python 3.10+](https://www.python.org/downloads/)
- [Ollama](https://ollama.com/download)
- [ngrok](https://ngrok.com/download) with an account and static domain configured

---

## Set up

### Create Virtual Environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file in the project root with the following:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLIC_KEY=your_supabase_public_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
HF_TOKEN=your_huggingface_token
OLLAMA_MODEL=your_ollama_model_name
```

| Variable               | Used In               | Description                       |
| ---------------------- | --------------------- | --------------------------------- |
| `SUPABASE_URL`         | `rag.py` & `embed.py` | Identifies your Supabase project  |
| `SUPABASE_PUBLIC_KEY`  | `rag.py`              | Read-only access for FAQ search   |
| `SUPABASE_SERVICE_KEY` | `embed.py`            | Write access to insert embeddings |
| `HF_TOKEN`             | `rag.py` & `embed.py` | Hugging Face token (optional)     |
| `OLLAMA_MODEL`         | `rag.py`              | Name of the Ollama model to use   |

---

## Usage

### Embed FAQs into the Database (ONLY RUN THIS IF FAQ ARE MISSING)

Run this once before starting the server to embed and store your FAQs into Supabase (edit FAQ_QUESTIONS in the file if necessary):

```bash
python embed.py
```

### Start the FastAPI Server

```bash
fastapi run rag.py
```

The server will be available at `http://localhost:8000` by default.

### Expose the Server with ngrok

In a separate terminal, start your ngrok static domain tunnel:

```bash
ngrok http --domain=your-static-domain.ngrok-free.app port
```

Your chatbot will then be publicly accessible at `https://your-static-domain.ngrok-free.app`.

### Test the Server

```bash
python test.py
```

By default it tests `localhost:8000`, but you can update the target IP in the script to test against your ngrok URL.

---

## Files

### `embed.py`

Creates a dictionary of FAQs, embeds the question + answer together using `all-MiniLM-L6-v2`, and stores them into the database for RAG.

**Usage:**

```bash
python embed.py
```

**To add/update FAQs:** Edit `FAQ_QUESTIONS` using the format below. Remove previous FAQs first, then add the new ones.

```python
{"question": , "answer": , "embedding": , "metadata": }
```

**To reset the FAQ database:** Clear all rows in the `faq` table, then run this script with your desired FAQs.

#### Environment Variables

| Variable               | Description               |
| ---------------------- | ------------------------- |
| `SUPABASE_SERVICE_KEY` | Your Supabase service key |

---

### `rag.py`

FastAPI server that powers Energi. Handles incoming chat requests by classifying the input with a locally hosted Ollama LLM, performing semantic similarity search over the FAQ database (Supabase) using `all-MiniLM-L6-v2` embeddings, and generating responses.

**Usage:**

```bash
fastapi run rag.py
```

#### Endpoints

##### `POST /chat`

API endpoint for the React Native app to communicate with the chatbot. Calls `classify_and_expand`, `search_faq` (if the input was not a greeting/farewell/pleasantry), and finally the LLM to generate a response.

**Request body:**

```json
{
  "question": "string"
}
```

**Response:**

```json
{
  "response": "string"
}
```

#### Key Functions

| Function                                             | Description                                                                                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_faq(query, similarity_threshold, num_match)` | Performs semantic vector search over the `faq` table using negative inner product similarity. Returns matching FAQ entries or `-1` on database error. |
| `call_LLM(context, question)`                        | Sends the FAQ context and user question to the Ollama model and returns a plain-text response.                                                        |
| `classify_and_expand(question)`                      | Classifies input as a greeting/farewell or rewrites it into a clear, complete question for better FAQ matching.                                       |

#### Environment Variables

| Variable              | Description                     |
| --------------------- | ------------------------------- |
| `SUPABASE_URL`        | Your Supabase project URL       |
| `SUPABASE_PUBLIC_KEY` | Your Supabase public API key    |
| `HF_TOKEN`            | Hugging Face token (optional)   |
| `OLLAMA_MODEL`        | Name of the Ollama model to use |

---

### `test.py`

Tests the FastAPI server to ensure the chatbot was correctly set up and is running.

Defaults to `localhost:8000`, but the target IP can be changed to any host you wish to test against.

**Usage:**

```bash
python test.py
```

---

## Tech Stack

- **FastAPI** — API server
- **Supabase** — Vector database for FAQ storage and similarity search
- **all-MiniLM-L6-v2** — Sentence embedding model (via `sentence-transformers`)
- **ngrok** — Tunneling service to expose the local server publicly (only for prototype testing)
- **Ollama** — Locally hosted LLM for response generation
- **Pydantic** — Request validation
- **python-dotenv** — Environment variable management
