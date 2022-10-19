import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './App.css';
import axios from 'axios';
import debounce from 'lodash.debounce';

interface News {
  title: string;
  url: string;
  author: string;
  objectID: string;
}

export const FetchDataWithDebounce = () => {
  const [data, setData] = useState<{ hits: News[] }>({ hits: [] });

  const debouncedChangeHandler = useMemo(
    () => debounce((query) => fetchData(query), 3000),
    []
  );

  // Stop the invocation of the debounced function after unmounting
  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    debouncedChangeHandler(event.target.value);
  };

  const fetchData = async (query = 'react') => {
    const result = await axios(
      `https://hn.algolia.com/api/v1/search?query=${query}`
    );

    setData(result.data);
  };

  return (
    <>
      <input onChange={changeHandler} placeholder='Search' type='text' />
      <ul>
        {data.hits.map((item) => (
          <li key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
};
