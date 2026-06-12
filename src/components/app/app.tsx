import { useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth } from '../../services/slices/user-slice';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { selectIsAuthChecked } from '@selectors';

type TLocationState = {
  background?: Location;
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as TLocationState | null;
  const background = locationState?.background;
  const isAuthChecked = useSelector(selectIsAuthChecked);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {!isAuthChecked ? (
        <Preloader />
      ) : (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleCloseModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal title='' onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal title='' onClose={handleCloseModal}>
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
