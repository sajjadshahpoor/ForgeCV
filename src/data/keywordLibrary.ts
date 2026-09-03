// A curated dictionary of multi-word and single-word industry/skill terms.
// Used so keyword extraction favors real skills/tools over generic English words.
export const KNOWN_SKILL_TERMS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang', 'rust', 'ruby', 'php', 'swift',
  'kotlin', 'scala', 'sql', 'html', 'css', 'html5', 'css3', 'bash', 'shell scripting',
  // Frontend
  'react', 'react.js', 'vue', 'vue.js', 'angular', 'next.js', 'nuxt', 'svelte', 'redux', 'tailwind', 'tailwindcss',
  'sass', 'webpack', 'vite', 'jquery', 'graphql', 'rest api', 'restful api', 'web accessibility', 'wcag',
  // Backend
  'node.js', 'nodejs', 'express', 'django', 'flask', 'spring', 'spring boot', '.net', 'asp.net', 'laravel',
  'fastapi', 'microservices', 'api design', 'grpc',
  // Data
  'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'snowflake', 'data warehousing',
  'etl', 'airflow', 'spark', 'hadoop', 'kafka', 'data pipelines', 'data modeling', 'pandas', 'numpy',
  // ML/AI
  'machine learning', 'deep learning', 'nlp', 'natural language processing', 'computer vision', 'tensorflow',
  'pytorch', 'scikit-learn', 'llm', 'large language models', 'generative ai', 'mlops', 'data science',
  // Cloud/DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'github actions',
  'devops', 'cloudformation', 'ansible', 'linux', 'nginx', 'serverless', 'lambda',
  // Testing
  'unit testing', 'integration testing', 'jest', 'cypress', 'playwright', 'selenium', 'test automation', 'tdd',
  // Product/Design
  'figma', 'sketch', 'ui/ux', 'user research', 'wireframing', 'prototyping', 'design systems', 'a/b testing',
  // PM/Business
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'stakeholder management', 'product roadmap', 'go-to-market',
  'okrs', 'kpis', 'budget management', 'cross-functional collaboration', 'project management', 'pmp',
  // Soft/general
  'leadership', 'communication', 'problem solving', 'team management', 'mentoring', 'strategic planning',
  'data analysis', 'data-driven decision making', 'customer success', 'sales', 'negotiation', 'salesforce',
  'excel', 'power bi', 'tableau', 'seo', 'content marketing', 'digital marketing', 'google analytics',
];

export const STOPWORDS = new Set([
  'the', 'and', 'a', 'an', 'to', 'of', 'in', 'for', 'on', 'with', 'is', 'are', 'as', 'at', 'by', 'be', 'this',
  'that', 'we', 'you', 'your', 'our', 'will', 'or', 'from', 'have', 'has', 'it', 'their', 'they', 'who', 'which',
  'role', 'job', 'work', 'working', 'team', 'teams', 'years', 'year', 'experience', 'strong', 'ability', 'skills',
  'including', 'etc', 'other', 'such', 'all', 'about', 'into', 'across', 'per', 'us', 'like', 'plus', 'looking',
  'candidate', 'candidates', 'requirements', 'required', 'preferred', 'must', 'should', 'can', 'able', 'new',
  'company', 'position', 'apply', 'application', 'benefits', 'if', 'not', 'but', 'so', 'than', 'these', 'those',
]);
