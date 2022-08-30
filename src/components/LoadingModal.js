import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const boxStyles = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   outline: 'none',
   width: 250,
   height: 250,
   padding: '50px',
};

const LoadingModal = ({ isLoading }) => {
   return (
      <Modal open={isLoading} aria-label="Loading indicator">
         <Box sx={boxStyles}>
            <CircularProgress size={150} />
         </Box>
      </Modal>
   );
};

export default LoadingModal;
