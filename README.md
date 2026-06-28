# VerifiMe — Multi-Currency Invoice Calculator

A full-stack application that calculates invoice totals across multiple currencies using historical exchange rates from the [Frankfurter API](https://frankfurter.dev).

## Project Structure

```text
VerifiMe/
├── backend/     # Quarkus Java REST API (port 8080)
├── frontend/    # Next.js + TypeScript + Material UI
└── README.md
```

## Local Development

### Prerequisites

- Java 17+
- Node.js 18+

### Backend

```bash
cd backend
./mvnw quarkus:dev        # Unix/macOS
mvnw.cmd quarkus:dev      # Windows
```

The API runs at `http://localhost:8080`.

**Endpoints:**
- `GET /currencies` — returns available currencies from Frankfurter (JSON)
- `POST /invoice/total` — accepts JSON and returns a `text/plain` total rounded to 2 decimal places

Example request:

```json
{
  "invoice": {
    "currency": "NZD",
    "date": "2020-07-07",
    "lines": [
      { "description": "Intel Core i9", "currency": "USD", "amount": 700 },
      { "description": "ASUS ROG Strix", "currency": "AUD", "amount": 500 }
    ]
  }
}
```

Example response: `1599.48` (Frankfurter v2 rates)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The UI posts to the backend at `http://localhost:8080` (configurable via `NEXT_PUBLIC_API_URL` in `frontend/.env.local`).

### Run Tests

```bash
cd backend
./mvnw test
```

---

## Deployment Strategy (AWS)

This application is stateless and does not require a database, making it simple to deploy and scale.

### Frontend Hosting

I would host the Next.js frontend on **Vercel** (or AWS Amplify).

**Why:**
- Easy deployment directly from GitHub
- Automatic HTTPS
- Built-in CDN for fast page loading
- Simple environment variable management

The frontend would communicate with the backend using the backend API URL configured through an environment variable.

### Backend Hosting

I would deploy the Quarkus backend on an **Amazon EC2** instance.

**Why:**
- Simple and reliable for hosting a Java application
- Easy to deploy by running the packaged JAR or a Docker container
- Can be scaled later if application traffic increases

For production, I would place an **Application Load Balancer (ALB)** in front of the EC2 instance to handle HTTPS requests and route traffic to the application.

### Security

- Use **HTTPS** for all communication.
- Configure **CORS** so only the frontend can access the backend API.
- Store any future secrets or credentials securely using **AWS Secrets Manager** instead of hardcoding them.
- Configure **Security Groups** to allow only the required network traffic.

### Monitoring & Logging

To make it easier to monitor the application in production:

- Use **AppDynamics** to monitor application performance and quickly identify slow or failing requests.
- Use **Splunk** to collect and search application logs for debugging and root cause analysis.

### Scalability & Cost

- The frontend is served through a CDN and scales automatically.
- For this application, a single EC2 instance is enough to handle normal traffic while keeping costs low.
- If traffic grows, additional EC2 instances can be added behind the Application Load Balancer without changing the application since it is stateless.

### Infrastructure as Code

I would use **Terraform** or **AWS CDK** to automate the infrastructure setup, including:

- EC2 instance
- Application Load Balancer
- Security Groups
- IAM roles

This makes the infrastructure easy to recreate and maintain across different environments.
