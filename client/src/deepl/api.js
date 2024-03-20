
import axios from 'axios';

const deepLApiBaseUrl = 'https://api-free.deepl.com/v2/translate';

export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(deepLApiBaseUrl, {
      text,
      target_lang: targetLang,
    }, {
      headers: {
        'Authorization': 'DeepL-Auth-Key [b1551660-459b-617a-9575-4af3df61e848:fx]',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};
