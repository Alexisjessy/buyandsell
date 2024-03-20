import { DEEPL_API_KEY } from './deepl';

export const translateText = async (text, targetLang) => {
  try {
    const response = await fetch('http://alexislacroix.ide.3wa.io:3001/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLang: 'en',
        targetLang,
      }),
    });

    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error('Erreur lors de la traduction:', error);
    throw error; 
  }
};
