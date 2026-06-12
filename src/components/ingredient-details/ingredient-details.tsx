import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredientById, selectIngredientsLoading } from '@selectors';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector((state) =>
    selectIngredientById(state, id)
  );
  const isLoading = useSelector(selectIngredientsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <p className='text text_type_main-medium pt-10'>Ингредиент не найден</p>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
