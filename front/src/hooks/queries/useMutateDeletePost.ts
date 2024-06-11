import { deletePost } from "@/api";
import queryClient from "@/api/queryClient";
import { queryKeys } from "@/constants";
import { UseMutationCustomOptions } from "@/types";
import { useMutation } from "@tanstack/react-query";

function useMutateDeletePost(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.POST, queryKeys.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.MARKER, queryKeys.GET_MARKERS],
      });
    },
    ...mutationOptions,
  })
}


export default useMutateDeletePost;