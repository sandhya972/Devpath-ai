import { getGeminiModel } from '../config/gemini.js';

/**
 * Reusable service function to generate non-streaming JSON output from Gemini.
 * Includes intelligent fallback generator for quota limits or API errors.
 */
export async function generateJsonResponse({ prompt, systemInstruction, fallbackGenerator }) {
  try {
    const model = getGeminiModel('gemini-2.0-flash', {
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.warn('⚠️ Gemini API error or quota limit reached:', error.message);
    if (fallbackGenerator) {
      console.log('✨ Serving intelligent fallback response...');
      return fallbackGenerator();
    }
    throw error;
  }
}

/**
 * Reusable service function to stream Gemini AI output directly to Express response stream (SSE / Chunked).
 */
export async function streamResponse({ prompt, systemInstruction, res, fallbackGenerator }) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const model = getGeminiModel('gemini-2.0-flash', {
      systemInstruction,
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.warn('⚠️ Streaming failed due to Gemini API quota/error:', error.message);
    if (fallbackGenerator) {
      console.log('✨ Streaming intelligent fallback content...');
      const fallbackObj = fallbackGenerator();
      const textToStream = JSON.stringify(fallbackObj, null, 2);

      // Stream fallback text in smooth chunks
      const chunkSize = 20;
      for (let i = 0; i < textToStream.length; i += chunkSize) {
        const slice = textToStream.slice(i, i + chunkSize);
        res.write(`data: ${JSON.stringify({ chunk: slice })}\n\n`);
        await new Promise((r) => setTimeout(r, 20));
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Stream processing error' })}\n\n`);
      res.end();
    }
  }
}
