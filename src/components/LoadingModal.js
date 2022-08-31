import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { modalStyles } from 'styles/styles';

const LoadingModal = ({ isLoading }) => {
   return (
      <Modal open={isLoading} aria-label="Loading indicator">
         <Box sx={modalStyles}>
            <CircularProgress size={150} />
         </Box>
      </Modal>
   );
};

export default LoadingModal;
