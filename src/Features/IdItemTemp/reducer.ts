import { createSlice, PayloadAction } from 'redux-starter-kit';

export interface itemObj {
  [key: string]: any;
}
export type LastKnownMeasurement = {
  getLastKnownMeasurement: itemObj;
};

export type ApiErrorAction = {
  error: string;
};
const initialState = {
  metricName: 'flareTemp',
  getLastKnownMeasurement: {},
};

const slice = createSlice({
  name: 'lastKnownMeasurement',
  initialState,
  reducers: {
    lastKnownMeasurementDataRecevied: (state, action: PayloadAction<LastKnownMeasurement>) => {
      state.getLastKnownMeasurement = action.payload.getLastKnownMeasurement;
    },
    lastKnownMeasurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
