import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../store'

type PizzaItem = {
    id: string;
    title: string;
    types: number[];
    sizes: number[];
    price: number;
    imageUrl: string;
}

enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

interface PizzaSliceState {
    items: PizzaItem[];
    status: Status;
}

export type SearchPizzaParams = {
  order: string;
  sortBy: string;
  category: string;
  search: string;
  currentPage: string;
}

export const fetchPizzas = createAsyncThunk<PizzaItem[], SearchPizzaParams>('pizza/fetchPizzasStatus', async (params) => {
  const { order, sortBy, category, search, currentPage } = params
  const { data } = await axios.get<PizzaItem[]>(
    `https://64ad0680b470006a5ec53693.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
  )
  return data
})

const initialState: PizzaSliceState = {
  items: [],
  status: Status.LOADING,
}

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<PizzaItem[]>) {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.status = Status.LOADING
        state.items = []
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = Status.SUCCESS
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = Status.ERROR
        state.items = []
      })
  },
})

export const selectPizzaData = (state: RootState) => state.pizzaSlice

export const { setItems } = pizzaSlice.actions

export default pizzaSlice.reducer
