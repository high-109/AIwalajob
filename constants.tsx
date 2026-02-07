
import { Job } from './types';

// Based on the 4 columns: Date/Time, Title, Description, Apply URL
export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    dateTime: '2024-05-20 10:30',
    title: 'Senior AI Research Engineer',
    description: 'We are looking for a Senior AI Research Engineer to lead our LLM development team. Experience with PyTorch, Transformers, and distributed training is essential. You will be working on next-generation multimodal models that push the boundaries of current state-of-the-art architectures.',
    applyUrl: 'https://openai.com/careers',
    company: 'OpenAI',
    location: 'San Francisco, CA',
    category: 'Engineering'
  },
  {
    id: '2',
    dateTime: '2024-05-19 14:15',
    title: 'Machine Learning Product Manager',
    description: 'Join our product team to define the roadmap for AI-driven customer experiences. You will bridge the gap between engineering and business, translating user needs into technical requirements for our ML team.',
    applyUrl: 'https://careers.google.com',
    company: 'Google DeepMind',
    location: 'London, UK',
    category: 'Product'
  },
  {
    id: '3',
    dateTime: '2024-05-18 09:00',
    title: 'AI Prompt Designer',
    description: 'Looking for a creative individual who understands the nuances of LLM latent space. You will design, test, and iterate on complex prompts to ensure our creative tools generate high-quality outputs across multiple domains.',
    applyUrl: 'https://www.anthropic.com/careers',
    company: 'Anthropic',
    location: 'Remote',
    category: 'Design'
  },
  {
    id: '4',
    dateTime: '2024-05-17 16:45',
    title: 'MLOps Architect',
    description: 'Scale our production inference pipelines. Expert knowledge of Kubernetes, NVIDIA Triton, and low-latency API design required. You will ensure our models serve millions of requests with sub-100ms latency.',
    applyUrl: 'https://nvidia.com/jobs',
    company: 'NVIDIA',
    location: 'Santa Clara, CA',
    category: 'Engineering'
  },
  {
    id: '5',
    dateTime: '2024-05-16 11:20',
    title: 'Generative AI Strategist',
    description: 'Help Fortune 500 companies integrate generative AI into their workflows. You should have a deep understanding of the current AI ecosystem and the ability to articulate ROI for complex technical implementations.',
    applyUrl: 'https://www.accenture.com/careers',
    company: 'Accenture',
    location: 'New York, NY',
    category: 'Other'
  }
];
