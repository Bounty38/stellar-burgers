import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  TConstructorIngredient,
  TConstructorItems,
  TIngredient
} from '@utils-types';

const initialState: TConstructorItems = {
  bun: null,
  ingredients: []
};

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          const { id, ...bun } = action.payload;
          state.bun = bun;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: uuidv4()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;
      const lastIndex = state.ingredients.length - 1;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex > lastIndex ||
        toIndex > lastIndex ||
        fromIndex === toIndex
      ) {
        return;
      }

      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },
    clearConstructor: () => initialState
  }
});

export const {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
