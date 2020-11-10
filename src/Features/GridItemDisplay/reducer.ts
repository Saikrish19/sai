import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ListDisplay = string[];

export type ApiErrorAction = {
  error: string;
};
export interface metricType {
  getMetrics: string[];
}

const initialState: metricType = {
  getMetrics: [],
};
const slice = createSlice({
  name: 'listDis',
  initialState,
  reducers: {
    equipmentsListDataRecevied: (state, action: PayloadAction<ListDisplay>) => {
      // const getMetrics = action.payload;
      state.getMetrics = action.payload;
    },
    equipmentsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
