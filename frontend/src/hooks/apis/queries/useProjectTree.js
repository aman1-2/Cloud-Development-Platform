import { useQuery } from '@tanstack/react-query';

import { getProjectTreeApi } from '../../../apis/projects';

export const usePorjectTree = ( projectId ) => {
    const {isLoading, isError, data: projectTree, error} = useQuery({
        queryKey: [`projectTree-${projectId}`],
        queryFn: () => getProjectTreeApi({ projectId }),
        // enabled: !!projectId //Prevents query running when projectId is undefined
    });

    return {
        isLoading, 
        isError,
        projectTree,
        error
    };
}