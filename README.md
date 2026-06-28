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

On Windows, if Quarkus asks about analytics on first run:

```powershell
$env:QUARKUS_ANALYTICS_DISABLED="true"
.\mvnw.cmd quarkus:dev
```

The API runs at `http://localhost:8080`.

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/currencies` | Returns available currencies from Frankfurter (JSON) |
| POST | `/invoice/total` | Calculates the invoice total (returns `text/plain`) |

**Example request** (`POST /invoice/total`):

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

**Example success response:** `1599.48`

This uses Frankfurter v2 rates. The total may differ slightly from the challenge PDF example (`1600.86`), which was based on v1 rates.

**Error responses** (all `text/plain`, prefixed with `Error:`):

| Status | When it happens | Example body |
|--------|-----------------|--------------|
| 400 | Invalid or missing data in the request | `Error: Invoice is required` |
| 404 | Exchange rate not found for the date or currencies | `Error: Exchange rate data not found for the given date or currencies` |
| 500 | Unexpected server failure | `Error: An unexpected error occurred` |

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # Unix/macOS
copy .env.example .env.local   # Windows
npm run dev
```

Open `http://localhost:3000`. The UI calls the backend at `http://localhost:8080` by default. You can change this in `frontend/.env.local` via `NEXT_PUBLIC_API_URL`.

### Run Tests

```bash
cd backend
./mvnw test        # Unix/macOS
mvnw.cmd test      # Windows
```

---

## Deployment Strategy (AWS)

This application is stateless and does not need a database, which keeps deployment straightforward.

### Frontend Hosting

I would host the Next.js frontend on **Vercel** (AWS Amplify would also work well).

**Why Vercel:**

- Connects directly to GitHub — push to deploy
- HTTPS and CDN included out of the box
- Easy to set `NEXT_PUBLIC_API_URL` for each environment (dev, staging, prod)

The frontend only needs to know where the backend API lives. Everything else stays on the server side.

### Backend Hosting

I would run the Quarkus backend on a single **Amazon EC2** instance, with an **Application Load Balancer (ALB)** in front for HTTPS and routing.

**Why EC2 for this project:**

For a small REST API with no database, a single EC2 instance is enough to get started. I can deploy the app as a packaged JAR or a Docker image (Dockerfiles are included under `backend/src/main/docker/`). Because the service is stateless, I can add more EC2 instances behind the ALB later if traffic grows — without changing the application code.

### Security

- **HTTPS everywhere** — TLS certificates via AWS Certificate Manager (ACM) on the ALB
- **CORS** — restrict the backend to accept requests only from the frontend domain
- **Security Groups** — allow inbound traffic to the ALB from the internet, and only allow the ALB to reach EC2 on the app port (not open to the world directly)
- **Secrets** — Frankfurter does not need an API key today; any future credentials would go in **AWS Secrets Manager**, not in source code

### Monitoring & Logging

Since the backend runs on AWS, I would use the built-in tooling rather than adding extra services:

- **Amazon CloudWatch** — track CPU, memory, and request health; set alarms if the instance or API becomes unhealthy
- **CloudWatch Logs** — ship Quarkus application logs to a log group so I can search and debug issues after deployment

This gives enough visibility for an app of this size without extra cost or setup complexity.

### Scalability & Cost

- **Frontend:** served from Vercel's CDN — scales automatically, low cost at small traffic
- **Backend:** one EC2 instance handles normal load cheaply; add instances behind the ALB when needed
- **No database** — one less service to pay for and maintain; exchange rates come from Frankfurter

### Infrastructure as Code

I would use **Terraform** or **AWS CDK** to define the infrastructure so it can be recreated consistently across environments:

- VPC, subnets, and security groups
- EC2 instance (or ECR + Docker-based deploy)
- Application Load Balancer and target group
- ACM certificate for HTTPS
- IAM roles with least-privilege access
- CloudWatch log groups and basic alarms
- Route 53 (optional) — if using a custom domain

Keeping infrastructure in code makes changes reviewable and reduces manual setup mistakes when spinning up dev or production.

---

## Rounding Rules

- Exchange rates from Frankfurter are rounded to **4 decimal places** before use
- Each line total and the final invoice total are rounded to **2 decimal places** (standard half-up rounding)
