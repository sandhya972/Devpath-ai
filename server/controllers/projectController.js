import { generateJsonResponse, streamResponse } from '../services/geminiService.js';

export async function generateProjectPlan(req, res) {
  try {
    const { currentSkills, domain, difficulty, timeAvailable } = req.body;

    if (!currentSkills || !domain || !difficulty || !timeAvailable) {
      return res.status(400).json({
        error: 'Missing required fields: currentSkills, domain, difficulty, and timeAvailable are required.',
      });
    }

    const systemInstruction = `You are a Senior Principal Software Architect and AI Technical Mentor. 
    Design an impressive, portfolio-worthy software project specification tailored specifically to stand out on resumes for top-tier tech company applications (e.g., IBM Internship / Full-time software roles).
    Format your output strictly as a JSON object matching this exact schema:
    {
      "projectTitle": "Catchy & Professional Project Name",
      "description": "2-3 sentence high-impact summary of the project purpose and real-world problem solved.",
      "features": "Detailed bulleted list of key technical features and capabilities (Markdown format).",
      "techStack": "Comprehensive breakdown of Frontend, Backend, Database, Cloud/DevOps, and Authentication libraries (Markdown format).",
      "folderStructure": "Clean, standard directory tree snippet formatted as Markdown code block (\`\`\`txt ... \`\`\`).",
      "database": "Data models, schema design, tables/collections, and entity relationships (Markdown format).",
      "apiEndpoints": "Structured list or table of RESTful/GraphQL endpoints with HTTP methods, route paths, and payloads (Markdown format).",
      "developmentTimeline": "Phased implementation milestones mapped to the user's available timeframe (Markdown format).",
      "deploymentStrategy": "Step-by-step instructions for CI/CD, hosting (Vercel/Render/AWS/Docker), environment variables, and production setup (Markdown format).",
      "interviewQuestions": "Top technical architectural deep-dive questions an interviewer will ask about this project with key discussion points (Markdown format)."
    }`;

    const prompt = `Developer Specs:
    - Current Technical Stack / Skills: ${currentSkills}
    - Targeted Industry Domain: ${domain}
    - Desired Difficulty Level: ${difficulty}
    - Time Available to Build: ${timeAvailable}

    Generate a complete, industry-standard project blueprint.`;

    const fallbackGenerator = () => ({
      projectTitle: `CloudPulse: Real-Time ${domain} Analytics Engine`,

      description: `An enterprise-grade, high-throughput analytics platform built for ${domain}. It provides real-time metric ingestion, custom dashboard visualizations, role-based access control, and automated alerting services.`,

      features: `- **Real-Time Data Pipeline:** Stream telemetry metrics with low-latency WebSockets.\n- **Authentication & RBAC:** Secure JWT authentication with fine-grained user permissions.\n- **Interactive Analytics Dashboard:** Customizable charts, data filtering, and export to CSV/PDF.\n- **Automated Alerts:** Event-driven notification service sending alerts via Email/Slack webhook.\n- **API Rate Limiting & Caching:** Redis memory cache to prevent API abuse and reduce DB load.`,

      techStack: `- **Frontend:** React, Tailwind CSS, Recharts / Chart.js, Axios\n- **Backend:** Node.js, Express, WebSockets (Socket.io)\n- **Database:** PostgreSQL (with Prisma ORM) or MongoDB\n- **Caching:** Redis\n- **DevOps & Cloud:** Docker, GitHub Actions CI/CD, Render / AWS EC2`,

      folderStructure: `\`\`\`txt\ncloudpulse-app/\n├── client/\n│   ├── src/\n│   │   ├── components/\n│   │   ├── pages/\n│   │   ├── services/\n│   │   └── App.jsx\n│   └── package.json\n├── server/\n│   ├── config/\n│   ├── controllers/\n│   ├── middleware/\n│   ├── models/\n│   ├── routes/\n│   ├── services/\n│   └── index.js\n├── docker-compose.yml\n└── README.md\n\`\`\``,

      database: `### 🗄️ Database Schema Design\n\n1. **Users Table:**\n   - \`id\` (UUID, PK)\n   - \`email\` (VARCHAR, UNIQUE)\n   - \`password_hash\` (VARCHAR)\n   - \`role\` (ENUM: 'admin', 'developer', 'viewer')\n   - \`created_at\` (TIMESTAMP)\n\n2. **Metrics Table:**\n   - \`id\` (UUID, PK)\n   - \`user_id\` (UUID, FK -> Users.id)\n   - \`metric_name\` (VARCHAR)\n   - \`value\` (FLOAT)\n   - \`timestamp\` (TIMESTAMP, INDEXED)`,

      apiEndpoints: `### 🌐 REST API Endpoints\n\n| Method | Endpoint | Description | Auth Required |\n| --- | --- | --- | --- |\n| POST | \`/api/auth/register\` | Register new account | No |\n| POST | \`/api/auth/login\` | Authenticate & get JWT | No |\n| GET | \`/api/metrics\` | Fetch filtered metrics list | Yes (Bearer Token) |\n| POST | \`/api/metrics\` | Ingest new metric event | Yes |\n| GET | \`/api/health\` | Health check endpoint | No |`,

      developmentTimeline: `### ⏱️ ${timeAvailable} Implementation Timeline\n\n- **Milestone 1:** Architecture design, DB schema modeling, and Express API scaffolding.\n- **Milestone 2:** Implement JWT authentication, user roles, and core CRUD routes.\n- **Milestone 3:** Build React frontend dashboard with live chart visualizations.\n- **Milestone 4:** Containerize with Docker, write GitHub Actions CI/CD pipeline, and deploy.`,

      deploymentStrategy: `### 🚀 Production Deployment Guide\n\n1. **Containerization:** Write \`Dockerfile\` for client and server services.\n2. **Orchestration:** Use \`docker-compose.yml\` for local multi-container development.\n3. **Hosting:** Deploy client to Vercel/Netlify; deploy Express server & DB to Render/AWS EC2.\n4. **Environment Security:** Store \`JWT_SECRET\` and DB credentials safely in environment variables.`,

      interviewQuestions: `### 🎙️ Key Interview Deep-Dive Questions\n\n1. *How did you handle real-time metric streaming and prevent UI re-render lags?*\n   - **Answer:** Utilized WebSocket event listeners combined with React state batching and memoized chart components.\n2. *How did you secure your REST API against unauthorized access?*\n   - **Answer:** Implemented custom Express middleware validating Bearer JWT tokens and checking user role permissions.`,
    });

    if (req.query.stream === 'true') {
      return streamResponse({ prompt, systemInstruction, res, fallbackGenerator });
    }

    const resultData = await generateJsonResponse({ prompt, systemInstruction, fallbackGenerator });
    return res.status(200).json(resultData);
  } catch (error) {
    console.error('Error generating project plan:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating the project blueprint.',
    });
  }
}
