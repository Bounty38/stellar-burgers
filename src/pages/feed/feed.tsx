import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, setFeedFromSocket } from '../../services/slices/feed-slice';
import {
  selectFeedError,
  selectFeedLoading,
  selectFeedOrders
} from '@selectors';
import { WS_URL } from '../../utils/burger-api';
import { TOrdersData } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeed());

    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      const data: { success: boolean } & TOrdersData = JSON.parse(event.data);
      if (data.success) {
        dispatch(setFeedFromSocket(data));
      }
    };

    let closedByCleanup = false;

    ws.onerror = () => {
      ws.close();
    };

    ws.onclose = () => {
      if (!closedByCleanup) {
        dispatch(fetchFeed());
      }
    };

    return () => {
      closedByCleanup = true;
      ws.close();
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium pt-10'>{error}</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
