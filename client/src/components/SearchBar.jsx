
import React, { useState, useEffect,useRef} from 'react';
import { useGetKeywordsQuery } from '../features/api/apiSlice';
import { Link } from 'react-router-dom';

   const SearchBar = ({ onSearch, keywords, searchResults }) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [suggestions, setSuggestions] = useState([]);
   const [showResults, setShowResults] = useState(false);
   const searchRef = useRef(null);
 
  useEffect(() => {
    setSuggestions(keywords || []);
  }, [keywords]);

  useEffect(() => {
    
    if (searchResults.length === 0) {
      setSuggestions(keywords || []);
    }
  }, [keywords, searchResults]);

  const updateSuggestions = (input) => {
    const filteredSuggestions = keywords
      ? keywords.filter((keyword) =>
          keyword.toLowerCase().includes(input.toLowerCase())
        )
      : [];
    setSuggestions(filteredSuggestions);
  };

  const handleChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    updateSuggestions(input);
    onSearch(input);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    onSearch(suggestion);
  };

 
 
 const handleLinkClick = () => {
   
    setShowResults(false);
  };
  
  
  
   useEffect(() => {
    //  event listener to detect document clicks
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };


    document.addEventListener('click', handleOutsideClick);

    // Clean event listener when component is unmounted
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  
  return (
    <div className="search-bar" ref={searchRef}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleChange}
          onFocus={() => setShowResults(true)}
          
          
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
     

      {searchResults.length > 0 && (
       <div className={`search-results ${showResults ? 'show' : ''}`}>
          <h3>Résultats de la recherche :</h3>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>
                <Link to={`/ad/${result.id}`}onClick={handleLinkClick}>
                  <div>
                    <p>{result.title}-
                    {result.description}</p>
                    
                  
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
