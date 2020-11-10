import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as gridItemReducer } from '../Features/GridItemDisplay/reducer';
import { reducer as gridChartReducer } from '../Features/GridChartDisplay/reducer';
import { reducer as lastKnownMeasurementReducer } from '../Features/IdItemTemp/reducer';

export default {
  weather: weatherReducer,
  gridItemD: gridItemReducer,
  gridChartR: gridChartReducer,
  lastKnownMeasurement: lastKnownMeasurementReducer,
};
