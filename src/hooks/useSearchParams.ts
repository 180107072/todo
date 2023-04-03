import {useMemo, useRef, useState} from "react";

function updateURL(param: {[x: string]: string}) {
  let state = history.state;
  let title = document.title;
  let url = window.location.origin + window.location.pathname;

  if (!param.value || !param.value.length) {
    return history.pushState(state, title, url);
  }

  history.pushState(
    state,
    title,
    url + `?${param.key}=${encodeURI(param.value)}`
  );
}

export const useSearchParams = (
  key: string
): [string | null, (params: {[x: string]: string}) => void] => {
  const [searchParamsState, setSearchParams] = useState<Record<string, string>>(
    {}
  );
  const searchParams = useRef<URLSearchParams>(
    new URLSearchParams(location.search)
  );

  const query = useMemo(() => {
    Object.entries(searchParamsState).forEach(([key, value]) => {
      updateURL({key, value});
    });

    searchParams.current = new URLSearchParams(location.search);

    return searchParams.current;
  }, [searchParamsState]);

  const set = (params: {[x: string]: string}) => {
    setSearchParams({...searchParamsState, ...params});
  };

  return [query.get(key), set];
};
