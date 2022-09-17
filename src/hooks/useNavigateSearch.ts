import { createSearchParams, URLSearchParamsInit, useNavigate } from 'react-router-dom';

export const useNavigateSearch = () => {
	const navigate = useNavigate();

	// this hook return a function that take 2 arguments for navigate to a link with search params.
	return (pathname: string, params: URLSearchParamsInit | undefined) =>
		navigate({ pathname, search: `?${createSearchParams(params)}` });
};
