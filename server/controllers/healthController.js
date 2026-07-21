export async function checkHealth(req, res) {
  return res.status(200).json({
    status: 'ok',
    message: 'DevPath AI API Backend is running successfully.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
}
