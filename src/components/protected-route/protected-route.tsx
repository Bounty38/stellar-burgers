import { FC, ReactElement } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { selectIsAuthChecked, selectUser } from '@selectors';

type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const locationState = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    return <Navigate to={locationState?.from?.pathname || '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
