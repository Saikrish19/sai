import { spawn } from 'redux-saga/effects';
import weatherSaga from '../Features/Weather/saga';
import listDisplaySaga from '../Features/GridItemDisplay/saga';
import metricsSaga from '../Features/GridChartDisplay/saga';
import lastKnownMeasurement from '../Features/IdItemTemp/saga';

export default function* root() {
  yield spawn(weatherSaga);
  yield spawn(listDisplaySaga);
  yield spawn(metricsSaga);
  yield spawn(lastKnownMeasurement);
}
