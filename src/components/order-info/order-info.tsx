import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectOrderByNumber,
  selectSelectedOrder,
  selectSelectedOrderError,
  selectSelectedOrderRequest
} from '@selectors';
import {
  clearSelectedOrder,
  fetchOrderByNumber
} from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const isValidOrderNumber = Number.isFinite(orderNumber);
  const orderFromList = useSelector((state) =>
    selectOrderByNumber(state, isValidOrderNumber ? orderNumber : undefined)
  );
  const selectedOrder = useSelector(selectSelectedOrder);
  const selectedOrderRequest = useSelector(selectSelectedOrderRequest);
  const selectedOrderError = useSelector(selectSelectedOrderError);
  const orderData =
    orderFromList || selectedOrder?.number === orderNumber
      ? orderFromList || selectedOrder
      : null;

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(clearSelectedOrder());
  }, [dispatch, orderNumber]);

  useEffect(() => {
    if (!isValidOrderNumber || orderData) {
      return;
    }

    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, isValidOrderNumber, orderData, orderNumber]);

  useEffect(
    () => () => {
      dispatch(clearSelectedOrder());
    },
    [dispatch]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!isValidOrderNumber) {
    return (
      <p className='text text_type_main-medium pt-10'>
        Некорректный номер заказа
      </p>
    );
  }

  if (selectedOrderError) {
    return (
      <p className='text text_type_main-medium pt-10'>{selectedOrderError}</p>
    );
  }

  if (!orderInfo || selectedOrderRequest) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
