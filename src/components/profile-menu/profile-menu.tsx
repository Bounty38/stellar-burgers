import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user-slice';
import { clearUserOrders } from '../../services/slices/feed-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        dispatch(clearUserOrders());
        navigate('/login', { replace: true });
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
