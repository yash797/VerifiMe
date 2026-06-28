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

This section describes how I would deploy VerifiMe to a cloud environment. The application is stateless (no database), which simplifies the architecture.

### Frontend Hosting — AWS Amplify (or Vercel)

I would host the Next.js frontend on **AWS Amplify Hosting** (or **Vercel** for fastest Next.js integration).

**Why:**
- Native support for Next.js SSR and static export
- Built-in CDN (CloudFront when using Amplify)
- Automatic HTTPS with ACM certificates
- Git-based CI/CD on every push
- Low operational overhead for a UI-only tier

The frontend only needs a public URL and an environment variable (`NEXT_PUBLIC_API_URL`) pointing to the backend API.

### Backend Hosting — AWS ECS Fargate + ALB

I would containerize the Quarkus backend (JVM or native image) and run it on **Amazon ECS Fargate** behind an **Application Load Balancer (ALB)**.

**Why:**
- Quarkus produces efficient container images suitable for Fargate
- No EC2 server management; pay only for running tasks
- ALB provides HTTPS termination, health checks, and path-based routing
- Easy horizontal scaling by increasing task count
- Fits a small REST API without over-provisioning

**Alternative:** **AWS App Runner** for even simpler container deployment if traffic is low and advanced networking is not required.

### Security

| Area | Approach |
|------|----------|
| **Transport** | HTTPS everywhere via ACM on ALB and Amplify/CloudFront |
| **API access** | Restrict CORS to the frontend domain only in production |
| **Network** | Backend tasks in private subnets; ALB in public subnets |
| **Secrets** | No Frankfurter API key required; use AWS Secrets Manager for any future credentials |
| **Edge protection** | AWS WAF on ALB to filter common attacks |
| **Auth (future)** | API Gateway or ALB with Cognito/OAuth if authentication is added later |

### Scalability & Cost

- **Frontend:** Served from CDN; scales automatically with traffic; minimal cost at low volume
- **Backend:** ECS auto-scaling on CPU or ALB request count; scale to zero is possible with App Runner or scheduled scaling for dev environments
- **External dependency:** Frankfurter API handles exchange rate data — no database to provision or maintain
- **Cost profile:** Pay-per-use Fargate tasks + ALB + Amplify hosting; suitable for variable or moderate traffic without idle server cost

### Infrastructure as Code

I would use **AWS CDK** (TypeScript) or **Terraform** to define:

- VPC with public/private subnets
- ECR repository for backend container images
- ECS cluster, task definition, and Fargate service
- ALB, target group, and listener rules
- Amplify app connected to the Git repository
- IAM roles with least-privilege permissions
- CloudWatch log groups and alarms

This enables reproducible environments (dev/staging/prod) and reviewable infrastructure changes in pull requests.

---

## Evaluation Notes

- Exchange rates from Frankfurter are rounded to **4 decimal places** before calculation
- Line totals and the final invoice total are rounded to **2 decimal places** (HALF_UP)
- Error responses are `text/plain` prefixed with `Error:`
