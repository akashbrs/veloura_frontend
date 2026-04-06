import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from '@/routes/AppRouter';
import { fetchUserIfNeeded } from '@/redux/slices/authSlice';
import type { AppDispatch } from '@/redux';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchUserIfNeeded());
    }
  }, [dispatch]);

  // Guest cart sync disabled as backend does not currently support explicit merges

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
