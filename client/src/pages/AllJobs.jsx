import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components/index';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext } from 'react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const allJobsQuery = (params) => {
  const { search, jobStatus, jobType, sort, page } = params;
  return {
    queryKey: [
      'jobs',
      search ?? '',
      jobStatus ?? 'all',
      jobType ?? 'all',
      sort ?? 'newest',
      page ?? 1,
    ],
    queryFn: async () => {
      const response = await customFetch.get('/jobs', {
        params: params,
      });
      const data = response.data;
      return data;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    try {
      const data = await queryClient.ensureQueryData(allJobsQuery(params));
      return { data, searchValues: { ...params } };
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      return error;
    }
  };

// set up context api
const AllJobsContext = React.createContext();

const AllJobs = () => {
  const { searchValues } = useLoaderData();
  const { data } = useQuery(allJobsQuery(searchValues));
  // console.log(data);
  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

// custom hook
export const useAllJobsContext = () => {
  return useContext(AllJobsContext);
};

export default AllJobs;
