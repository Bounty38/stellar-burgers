import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, loginUser } from '../../services/slices/user-slice';
import { selectUserError } from '@selectors';

type TLocationState = {
  from?: { pathname: string };
};

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useSelector(selectUserError);
  const locationState = location.state as TLocationState | null;

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  useEffect(() => {
    if (error) dispatch(clearUserError());
  }, [dispatch, email, password]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(locationState?.from?.pathname || '/', { replace: true });
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
