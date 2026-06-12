import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  setUserOrdersFromSocket
} from '../../services/slices/feed-slice';
import {
  selectUserOrders,
  selectUserOrdersError,
  selectUserOrdersLoading
} from '@selectors';
import { WS_URL } from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';
import { TOrder } from '@utils-types';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);

  useEffect(() => {
    dispatch(fetchUserOrders());

    const token = getCookie('accessToken');
    if (!token) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onmessage = (event) => {
      const data: { success: boolean; orders: TOrder[] } = JSON.parse(
        event.data
      );
      if (data.success) {
        dispatch(setUserOrdersFromSocket(data.orders));
      }
    };

    let closedByCleanup = false;

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      if (!closedByCleanup) {
        dispatch(fetchUserOrders());
      }
    };

    return () => {
      closedByCleanup = true;
      ws.close();
    };
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium pt-10'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
