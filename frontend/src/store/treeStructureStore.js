import { create } from 'zustand';
import { QueryClient } from '@tanstack/react-query';

import { getProjectTreeApi } from "../apis/projects.js";

const queryClient = new QueryClient();

export const useTreeStructureStore = create((set, get) => {
    
    return {
        projectId: null,
        treeStructure: null,
        setTreeStructure: async () => {
            const projectId = get().projectId;
            const data = await queryClient.fetchQuery({
                queryKey: [`projectTree-${projectId}`],
                queryFn: () => getProjectTreeApi({ projectId: projectId })
            });
            
            console.log(data)

            set({
                treeStructure: data
            });
        },
        setProjectId: (projectId) => {
            set({
                projectId: projectId
            }); 
        }
    }
})