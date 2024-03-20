
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [targetLang, setTargetLang] = useState(i18n.language);

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setTargetLang(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="language-selector">
      <select onChange={handleLanguageChange} value={targetLang}>
        <option value="fr">🇫🇷</option>
        <option value="en">🇬🇧</option>
        <option value="lo">🇱🇦</option>
      </select>
    </div>
  );
}

export default LanguageSelector;
