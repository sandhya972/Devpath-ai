import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout for AI generation
});

export async function checkHealth() {
  const response = await api.get('/health');
  return response.data;
}

export async function generateCareerRoadmap(data) {
  const response = await api.post('/career', data);
  return response.data;
}

export async function generateProjectPlan(data) {
  const response = await api.post('/project', data);
  return response.data;
}

/**
 * Stream Career Roadmap using Fetch ReadableStream
 */
export async function streamCareerRoadmap(data, onChunk, onDone, onError) {
  try {
    const response = await fetch('/api/career?stream=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }
            if (parsed.done) {
              onDone();
              return;
            }
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch (e) {
            // Ignore partial parse errors
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err.message || 'Streaming request failed');
  }
}

/**
 * Stream Project Plan using Fetch ReadableStream
 */
export async function streamProjectPlan(data, onChunk, onDone, onError) {
  try {
    const response = await fetch('/api/project?stream=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }
            if (parsed.done) {
              onDone();
              return;
            }
            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch (e) {
            // Ignore partial parse errors
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err.message || 'Streaming request failed');
  }
}

export default api;
