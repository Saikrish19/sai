import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { useQuery } from 'urql';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IState } from '../../store';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export interface itemObj {
  [key: string]: any;
}
export interface itemSlcVal {
  selectedItem?: itemObj[];
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1)
    },
    value: {
      fontSize: '1.8rem',
      padding: theme.spacing(1),
      flex: 'auto',
      color: '#273142',
    },
    text: {
      fontSize: '1.3rem',
      flex: '1',
      justifyContent: 'center',
      textTransform: 'capitalize',
      fontWeight: 'bold',
      color: '#273142',
      display: 'flex',
      alignItems: 'center',
    },
  }),
);
export interface myArray {
  myArray: any[];
}

const query = `
query($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
        metric
        at
        value
        unit
      }
}
`;

const getLastKnownMeasurement = (state: IState) => {
  const lastKnownMeasurement = state.lastKnownMeasurement.getLastKnownMeasurement;

  return {
    lastKnownMeasurement,
  };
};

let metricdata: itemObj;
const IdItemTemp: React.FC<any> = (selectedItem: itemObj) => {
  const classes = useStyles();
  let [metricValue, onmetricSelected] = useState<itemObj>({});

  const dispatch = useDispatch();
  const [result] = useQuery({
    query,
    variables: {
      metricName: selectedItem.selectedItem,
    },
    pollInterval: 1300,
    requestPolicy: 'network-only',
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.lastKnownMeasurementApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    metricdata = data.getLastKnownMeasurement;

    onmetricSelected(data.getLastKnownMeasurement);
  }, [dispatch, data, error]);

  if (fetching) return <CircularProgress color="inherit"/>;
  return (
    <div className={classes.root}>
      <span className={classes.text}>{metricValue ? metricValue.metric : null}</span>
      <strong className={classes.value}>{metricValue ? metricValue.value : null}</strong>
    </div>
  );
};

export default IdItemTemp;
