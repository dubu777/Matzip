import {ResponseCalendarPost, getCalendatPosts} from '@/api';
import {queryKeys} from '@/constants';
import {UseQueryCustomOptions} from '@/types';
import {useQuery} from '@tanstack/react-query';

function useGetCalendarPosts(
  year: number,
  month: number,
  queryOptions?: UseQueryCustomOptions<ResponseCalendarPost>,
) {
  return useQuery({
    queryFn: () => getCalendatPosts(year, month),
    queryKey: [queryKeys.POST, queryKeys.GET_CALENDAR_POST, year, month],
    ...queryOptions,
  });
}

export default useGetCalendarPosts;