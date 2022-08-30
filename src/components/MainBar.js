import Link from 'next/link';
import { useRouter } from 'next/router';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import useUser from 'stores/User';

function MainBar() {
   const router = useRouter();
   const {
      currentUser,
      actions: { clearUser },
   } = useUser();

   const handleLogout = () => {
      clearUser();
   };

   const showNewUser = router.pathname === '/login';

   const showLogOut = !showNewUser && currentUser;

   return (
      <AppBar position="static">
         <Toolbar>
               <Typography variant="h3" component="h1" sx={{ flexGrow: 1 }}>
                  <Link href="/">
                     Aeolian
                  </Link>
               </Typography>
               {showLogOut ? (
                  <Button onClick={handleLogout}>Log Out</Button>
               ) : (
                  <Link href={showNewUser ? '/newUser' : '/login'} passHref>
                     <Button>{showNewUser ? 'New User' : 'Log In'}</Button>
                  </Link>
               )}
         </Toolbar>
      </AppBar>
   );
}

export default MainBar;
