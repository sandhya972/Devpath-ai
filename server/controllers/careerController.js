import { generateJsonResponse, streamResponse } from '../services/geminiService.js';

export async function generateCareerPlan(req, res) {
  try {
    const { collegeYear, skills, interests, dreamCompany, careerGoal } = req.body;

    if (!collegeYear || !skills || !interests || !dreamCompany || !careerGoal) {
      return res.status(400).json({
        error: 'Missing required fields: collegeYear, skills, interests, dreamCompany, and careerGoal are required.',
      });
    }

    const systemInstruction = `You are an expert AI Career Mentor specializing in helping computer science students and tech job seekers prepare for top tech internships and full-time roles (e.g., IBM, FAANG, high-growth startups). 
    Provide actionable, highly structured advice formatted as Markdown strings inside each JSON field.
    Return ONLY a valid JSON object matching this exact schema:
    {
      "skillGap": "Detailed Skill Gap Analysis comparing user skills vs target company expectations (Markdown format)",
      "ninetyDayRoadmap": "Comprehensive 90-Day Step-by-Step Milestone Roadmap divided into Phase 1 (Days 1-30), Phase 2 (Days 31-60), Phase 3 (Days 61-90) (Markdown format)",
      "weeklyLearningPlan": "Actionable Weekly Study & Build Routine with day-by-day or focus area breakdowns (Markdown format)",
      "learningResources": "Curated list of top books, documentation, free & paid courses, YouTube channels, and practice platforms (Markdown format)",
      "interviewTopics": "Key Technical Core Topics, System Design concepts, Coding Patterns, and Behavioral Question preparation tailored for target company (Markdown format)"
    }`;

    const prompt = `Student Profile:
    - College Year / Level: ${collegeYear}
    - Current Skills & Tools: ${skills}
    - Domains of Interest: ${interests}
    - Dream Company / Target Role: ${dreamCompany}
    - Specific Career Goal: ${careerGoal}

    Generate a comprehensive, personalized career roadmap for this student.`;

    const fallbackGenerator = () => ({
      skillGap: `### 🎯 Skill Gap Analysis for ${dreamCompany}\n\n**Current Strengths:** ${skills}\n**Target Goal:** ${careerGoal} (${collegeYear})\n\n1. **Core Architecture Gaps:** Need deeper knowledge in distributed systems, RESTful API contract design, and caching layers (Redis/Memcached).\n2. **Database Proficiency:** Transition from basic SQL/Mongo queries to index optimization, query execution plan analysis, and database schema normalization.\n3. **DevOps & CI/CD:** Practice Docker containerization, GitHub Actions workflows, and automated unit/integration testing.\n4. **System Design & Patterns:** Familiarity with microservices, message queues (Kafka/RabbitMQ), and load balancing techniques expected at ${dreamCompany}.`,

      ninetyDayRoadmap: `### 🗓️ 90-Day Execution Roadmap for ${dreamCompany}\n\n#### 📍 Phase 1: Core Fundamentals & DSA (Days 1-30)\n- Master Data Structures: Arrays, Strings, Hash Maps, Trees, Graphs, Dynamic Programming.\n- Solve 2-3 LeetCode Medium problems daily focusing on patterns (Two Pointers, Sliding Window, BFS/DFS).\n- Refactor current projects using clean code principles and solid Git workflow.\n\n#### 📍 Phase 2: System Architecture & Resume Projects (Days 31-60)\n- Build a full-stack production capstone project aligned with ${interests}.\n- Implement JWT authentication, rate limiting, and database indexing.\n- Containerize your project with Docker and deploy to cloud (Render/Vercel/AWS).\n\n#### 📍 Phase 3: Interview Mastery & Portfolio Polish (Days 61-90)\n- Conduct 5+ mock interviews (Pramp/Interviewing.io) focusing on communication.\n- Customize resume with bullet points using the Google XYZ formula (Accomplished X, measured by Y, by doing Z).\n- Apply directly to ${dreamCompany} internship/full-time postings and reach out to recruiters on LinkedIn.`,

      weeklyLearningPlan: `### ⏰ Weekly Study & Build Routine\n\n- **Monday - Wednesday (DSA & Problem Solving):** 2 hours/day practicing LeetCode Mediums. Focus on Tree traversals and Dynamic Programming.\n- **Thursday - Friday (Full Stack & Domain Skills):** 3 hours/day building your capstone project using ${skills}.\n- **Saturday (System Design & Cloud):** Read Designing Data-Intensive Applications; learn Docker & cloud deployment basics.\n- **Sunday (Review & Networking):** Write a blog post or LinkedIn update showcasing weekly code progress; connect with 3 software engineers at ${dreamCompany}.`,

      learningResources: `### 📚 Recommended Learning Resources\n\n1. **Books:**\n   - *Cracking the Coding Interview* by Gayle Laakmann McDowell\n   - *Designing Data-Intensive Applications* by Martin Kleppmann\n2. **Courses & Documentation:**\n   - Full Stack Open (University of Helsinki)\n   - MDN Web Docs & Official React/Node.js Documentation\n3. **Practice Platforms:**\n   - LeetCode / NeetCode 150 Roadmap\n   - System Design Primer (GitHub repository)`,

      interviewTopics: `### 💡 Top Interview Topics for ${dreamCompany}\n\n1. **Technical Coding:**\n   - Binary Tree Depth-First Search (DFS) & Breadth-First Search (BFS)\n   - Array Sliding Window & Hash Map Lookup Optimization\n2. **System Design:**\n   - Designing a Scalable URL Shortener or Real-time Messaging System\n   - Caching Strategies (Cache-Aside, Write-Through) & Database Sharding\n3. **Behavioral (STAR Method):**\n   - Tell me about a time you faced a difficult technical bug and resolved it.\n   - Describe a team project where you had a disagreement on architecture.`,
    });

    if (req.query.stream === 'true') {
      return streamResponse({ prompt, systemInstruction, res, fallbackGenerator });
    }

    const resultData = await generateJsonResponse({ prompt, systemInstruction, fallbackGenerator });
    return res.status(200).json(resultData);
  } catch (error) {
    console.error('Error generating career plan:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating the career roadmap.',
    });
  }
}
