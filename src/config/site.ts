/**
 * Central site configuration.
 *
 * Every section (Hero, About, Contact, Footer, metadata, JSON-LD, etc.)
 * should read from this file instead of hardcoding personal details
 * inline. Update it here once and it propagates everywhere.
 */

export const siteConfig = {
  name: "Md Aman Alam",
  role: "AI Engineer",
  roles: ["AI Engineer", "Platform Engineer", "DevOps Engineer"],
  tagline: "Building Production AI Systems with Agentic AI, MLOps & Cloud.",
  bio: "B.Tech Information Technology graduate focused on AI Engineering and Generative AI, with hands-on experience building and deploying Agentic AI systems, RAG applications, and machine learning services. Skilled in LangGraph, LangChain, FastAPI, PostgreSQL, Docker, AWS, and CI/CD, with experience developing tested, stateful, and production-oriented AI applications.",
  currentlyFocusedOn: "Agentic AI systems & RAG applications",
  location: "Dhanbad, Jharkhand, India",
  url: "https://portfolio-tau-seven-apt5vzjy71.vercel.app/",
  email: "amankhan34356@gmail.com",
  contactMessage:
    "Have a project, an idea, or an opportunity in mind? I’m always open to discussing AI engineering, backend systems, and DevOps.",
  availability: "Open to work, internships, freelance, and collaboration",
  links: {
    github: "https://github.com/Amankhan1009",
    linkedin: "https://www.linkedin.com/in/md-aman-alam-a04552289/",
    resume: "/Md%20Aman%20Alam%20Resume.pdf",
  },
  education: {
    degree: "B.Tech, Information Technology",
    institution: "Haldia Institute of Technology",
    graduationYear: "2026",
  },
  skills: [
    {
      category: "Languages",
      items: ["Python", "SQL", "Java"],
    },
    {
      category: "AI/ML & GenAI",
      items: [
        "Scikit-learn",
        "TensorFlow",
        "XGBoost",
        "LangChain",
        "LangGraph",
        "Hugging Face",
        "LLMs",
        "RAG",
        "Embeddings",
        "Vector Search",
        "Prompt Engineering",
        "Agentic AI",
      ],
    },
    {
      category: "Backend & Data",
      items: [
        "FastAPI",
        "Streamlit",
        "PostgreSQL",
        "MongoDB",
        "SQL Server",
        "SQLite",
        "ChromaDB",
        "REST APIs",
      ],
    },
    {
      category: "Cloud & MLOps",
      items: [
        "AWS",
        "Microsoft Azure",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Model Deployment",
        "Model Serving",
        "CI/CD Pipelines",
      ],
    },
    {
      category: "DevOps & Engineering",
      items: [
        "Git",
        "GitHub Actions",
        "Jenkins",
        "Linux",
        "Pytest",
        "Gitleaks",
        "Trivy",
        "Prometheus",
        "Grafana",
      ],
    },
  ],
  projects: [
    {
      name: "DeepCite",
      description:
        "An AI-powered research agent that performs structured research, verifies sources, extracts evidence, fact-checks findings, and generates citation-backed reports with human-in-the-loop approval and research-quality evaluation.",
      tags: ["Python", "LangGraph", "MCP", "FastAPI", "PostgreSQL"],
      github: "https://github.com/Amankhan1009/Deepcite.git",
      demo: "https://deepcite.vercel.app",
    },
    {
      name: "AegisAI — Enterprise AI Operations Platform",
      description:
        "A production-style AI operations platform designed for secure, reliable, observable, cost-aware, and testable AI service delivery.",
      tags: [
        "Python",
        "FastAPI",
        "Groq",
        "PostgreSQL",
        "Redis",
        "Prometheus",
        "OpenTelemetry",
        "Docker",
        "GitHub Actions",
        "Streamlit",
      ],
      github: "https://github.com/Amankhan1009/aegis-ai",
      demo: "https://aman-aegis-ai.streamlit.app",
    },
    {
      name: "Postgres MCP Server",
      description:
        "Production-grade AI database assistant for PostgreSQL with schema introspection, injection-hardened SQL execution, and Groq-powered SQL generation, explanation, optimization, and business insights.",
      tags: ["Python", "FastMCP", "SQLAlchemy", "Groq", "Neon PostgreSQL"],
      github: "https://github.com/Amankhan1009/postgres-mcp-server.git",
      docker:
        "https://hub.docker.com/repository/docker/amankhan1009/postgres-mcp-server",
    },
    {
      name: "Weather MCP Server",
      description:
        "An MCP server that gives AI assistants access to weather data through a focused set of tools for current conditions and forecasts.",
      tags: ["Python", "FastMCP", "MCP", "Weather API"],
      github: "https://github.com/Amankhan1009/weather-mcp-server",
      docker:
        "https://hub.docker.com/repository/docker/amankhan1009/weather-mcp-server/general",
    },
    {
      name: "DevOps AI Copilot",
      description:
        "An AI-powered DevOps assistant designed to help developers understand, troubleshoot, and automate common infrastructure and delivery workflows.",
      tags: ["Python", "LLMs", "Agentic AI", "Docker", "DevOps"],
      github: "https://github.com/Amankhan1009/devops-ai-copilot",
      demo: "https://aman-devops-ai-copilot.streamlit.app/",
    },
    {
      name: "AI File Assistant",
      description:
        "A conversational file assistant that uses retrieval-augmented generation to answer questions about uploaded documents and return grounded responses.",
      tags: ["Python", "RAG", "LangChain", "Embeddings", "Streamlit"],
      github: "https://github.com/Amankhan1009/File-Assistant-Agent",
      demo: "https://file-assistant-frontend.onrender.com/",
    },
    {
      name: "Customer Support AI Agent",
      description:
        "A stateful customer-support agent that combines conversational AI with retrieval and tool use to provide helpful, context-aware responses.",
      tags: ["Python", "LangGraph", "LangChain", "RAG", "FastAPI"],
      github: "https://github.com/Amankhan1009/customer-support-agent",
      demo: "https://customer-support-agent-frontend.onrender.com/",
    },
    {
      name: "Todo AI Agent",
      description:
        "An agentic todo application that lets users manage tasks through natural language while keeping actions structured and stateful.",
      tags: ["Python", "LangGraph", "FastAPI", "PostgreSQL", "LLMs"],
      github: "https://github.com/Amankhan1009/todo-agent",
      demo: "https://aman-todo-agent.streamlit.app/",
    },
    {
      name: "EDUGEN AI",
      description:
        "An AI learning platform that helps generate personalized educational content and supports students with interactive, practical study assistance.",
      tags: ["Python", "Generative AI", "Streamlit", "LLMs"],
      github: "https://github.com/Amankhan1009/EDUGEN-AI",
      demo: "https://aman-edugen-ai.streamlit.app/",
    },
    {
      name: "NL-to-SQL Chatbot",
      description:
        "A natural-language interface for exploring relational data, translating user questions into SQL and returning understandable database insights.",
      tags: ["Python", "SQL", "LLMs", "PostgreSQL", "Streamlit"],
      github: "https://github.com/Amankhan1009/NL-to-SQL-Chatbot",
    },
    {
      name: "Search Engine with LangChain",
      description:
        "A semantic search application that combines document processing, embeddings, and LangChain retrieval to return relevant results from a custom corpus.",
      tags: ["Python", "LangChain", "Embeddings", "Vector Search"],
      github: "https://github.com/Amankhan1009/Search-Engine-With-Langchain",
      demo: "https://search-engine-with-langchain-aman.streamlit.app/",
    },
    {
      name: "Project Green Vision",
      description:
        "A computer-vision project that applies machine learning to support environmental awareness and practical sustainability-focused insights.",
      tags: ["Python", "Computer Vision", "TensorFlow", "Streamlit"],
      github: "https://github.com/Amankhan1009/Project-Green-Vision",
    },
    {
      name: "Rock Paper Scissors Detector",
      description:
        "A real-time computer-vision game that recognizes hand gestures through a camera feed and classifies rock, paper, and scissors.",
      tags: ["Python", "Computer Vision", "TensorFlow", "OpenCV"],
      github: "https://github.com/Amankhan1009/Rock-Paper-Scissors-Detector",
      demo: "https://amankhan-rockpaperscissrdetector.streamlit.app/",
    },
  ],
  experience: [
    {
      company: "Capgemini",
      role: "Cloud & DevOps Trainee (Left Shift Program)",
      dates: "Jan 2026 – May 2026",
      bullets: [
        "Provisioned cloud infrastructure using Terraform and CloudFormation, including VPCs, EC2 instances, networking components, and Security Groups.",
        "Automated CI/CD workflows using GitHub, Jenkins, Docker, Kubernetes, EKS, Minikube, and Helm.",
        "Implemented infrastructure and application monitoring using Prometheus and Grafana to improve system observability.",
        "Built a security-integrated DevSecOps CI/CD pipeline using GitHub Actions, Gitleaks, Trivy, Infrastructure-as-Code security scanning, and automated Dev, Staging, and Production deployment workflows.",
      ],
    },
    {
      company: "Dataspace Academy",
      role: "Machine Learning & Cloud Intern",
      dates: "Jan 2025 – Mar 2025",
      bullets: [
        "Developed and evaluated machine learning models using Python and Scikit-learn, applying data preprocessing, feature engineering, model training, evaluation, and cloud deployment practices across end-to-end ML workflows.",
      ],
    },
  ],
  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
