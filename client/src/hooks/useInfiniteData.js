import React from "react";
import {useBottomScrollListener} from "react-bottom-scroll-listener";
import {useInfiniteQuery, useQuery} from "react-query";

export default function useInfiniteData({apiProps, apiCallId, apiCall}) {
  const {
    data: tweets,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch: reset,
  } = useInfiniteQuery(
    [apiCall?.name, apiCallId],
    ({pageParam}) => apiCall({pageParam, ...apiProps}),
    {
      getNextPageParam: (lastPage) => {
        return lastPage?.nextCursor;
      },
    }
  );

  const fetchMore = () => (hasNextPage ? fetchNextPage() : undefined);
  useBottomScrollListener(fetchMore, {
    offset: 300,
    debounce: 100,
    debounceOptions: {leading: true},
    triggerOnNoScroll: false,
  });

  return {
    tweets,
    isFetching,
    isFetchingNextPage,
    error,
    status,
    fetchMore,
    hasNextPage,
  };
}
