import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, registerUser } from '../../services/slices/user-slice';
import { selectUserError } from '@selectors';

type TLocationState = {
  from?: { pathname: string };
};

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
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
  }, [dispatch, email, password, userName]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        navigate(locationState?.from?.pathname || '/', { replace: true });
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
