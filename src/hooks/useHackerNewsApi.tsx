import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';

interface News {
  title: string;
  url: string;
  author: string;
  objectID: string;
}

function dataFetchReducer(state: any, action: { type: any; payload?: any }) {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
}

export const useHackerNewsApi = (
  initalData: {
    hits: News[];
  },
  initalUrl: string
): [
  React.Dispatch<React.SetStateAction<string>>,
  {
    isLoading: boolean;
    isError: boolean;
    data: {
      hits: News[];
    };
  }
] => {
  const [url, setUrl] = useState<string>(initalUrl);

  const initialState = {
    isLoading: false,
    isError: false,
    data: initalData,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
      try {
        const result = await axios(url);
        if (didCancel) return;
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        if (didCancel) return;
        dispatch({ type: 'FETCH_FAILURE' });
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);

  return [setUrl, state];
};
