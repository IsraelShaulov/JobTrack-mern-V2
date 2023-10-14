import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components/index';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext } from 'react';
import React from 'react';

export const loader = async ({ request }) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const response = await customFetch.get('/jobs', {
      params: params,
    });
    const data = response.data;
    return { data, searchValues: { ...params } };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

// set up context api
const AllJobsContext = React.createContext();

const AllJobs = () => {
  const { data, searchValues } = useLoaderData();
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
