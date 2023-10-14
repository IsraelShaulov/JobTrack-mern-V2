import React, { useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import { useNavigate } from 'react-router-dom';

const DeleteJob = ({ jobId }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDeleteJob = async () => {
    try {
      await customFetch.delete(`jobs/${jobId}`);
      toast.success('Job deleted successfully');
      closeModal();
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
    // Return to the page with all jobs after deletion
    return navigate('/dashboard/all-jobs');
  };

  return (
    <div>
      <button onClick={openModal} className='btn delete-btn'>
        Delete
      </button>
      <Modal
        className='Modal'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Delete Confirmation Modal'
      >
        <div className='button-container'>
          Are you sure you want to delete this job?
          <div>
            <button onClick={handleDeleteJob}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteJob;

// import { toast } from 'react-toastify';
// import customFetch from '../utils/customFetch';
// import { redirect } from 'react-router-dom';

// export const action = async ({ params }) => {
//   // console.log(params);
//   try {
//     await customFetch.delete(`jobs/${params.id}`);
//     toast.success('Job deleted successfully');
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//   }
//   return redirect('/dashboard/all-jobs');
// };
