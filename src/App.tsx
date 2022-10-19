import React, { ChangeEvent, useState } from 'react';
import './App.css';
import { useHackerNewsApi } from './hooks/useHackerNewsApi';

function App() {
  const [query, setQuery] = useState<string>('react');
  const [setUrl, { isLoading, isError, data }] = useHackerNewsApi(
    {
      hits: [],
    },
    `http://hn.algolia.com/api/v1/search?query=${query}`
  );

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          setUrl(`http://hn.algolia.com/api/v1/search?query=${query}`);
          event.preventDefault();
        }}
      >
        <input
          value={query}
          onChange={changeHandler}
          placeholder='Search'
          type='text'
        />
        <button type='submit'>Search</button>
      </form>
      {isError && <div>Something wrong...</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {data.hits.map((item) => (
            <li key={item.objectID}>
              <a href={item.url}>{item.title}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default App;
