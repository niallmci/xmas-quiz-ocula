// src/utils/api.js
// Replace these with your actual values after setting up Google Apps Script

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwskWyeiGh1ZV27_iWqtvOHR3emqs9w7la4ytYZxJ2pl3SwTptqyj2Q_nVrOK-uEQs/exec'
const ADMIN_PASSWORD = 'ocula2024'

export async function submitScore(data) {
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { success: true };
  } catch (error) {
    console.error('Failed to submit score:', error);
    return { success: false, error };
  }
}

export async function getScores(password) {
  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?password=${password}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch scores:', error);
    return [];
  }
}

export { ADMIN_PASSWORD };

