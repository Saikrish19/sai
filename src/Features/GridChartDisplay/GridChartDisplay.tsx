import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IState } from '../../store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: [MeasurementQuery]!) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      metric
      at
      value
      unit
    }
  }
}
`;
let timeCurrent = new Date().valueOf();
export interface itemObj {
  [key: string]: any;
}
export interface itemSlcVal {
  selectedItem?: itemObj[];
}

interface itemInt {
  label?: string | null;
  value?: any | null;
}

type itemType = itemInt[];

const chartdata = (data: any) => {
  if (data.length > 0) {
    let temp = [];
    let dlen = data[0].measurements.length;
    for (let i = 0; i < dlen; i++) {
      let obj: itemObj = {};
      for (let j = 0; j < data.length; j++) {
        // not all equip has same measurement length so
        if (data[j].measurements[i]) {
          obj[data[j].measurements[i].metric] = data[j].measurements[i].value;
          obj['at'] = new Date(data[j].measurements[i].at).toLocaleTimeString().replace(/:\d+ /, ' ');
        }
      }
      temp.push(obj);
    }
    return temp;
  } else {
    return [];
  }
};

const getMetrics = (state: IState) => {
  const getMultipleMeasurements = state.gridChartR.getMultipleMeasurements;
  return {
    getMultipleMeasurements,
  };
};

export const GridChartDisplay: React.FC<any> = (sel: itemSlcVal) => {
  const dispatch = useDispatch();
  const getMultipleMeasurements = useSelector(getMetrics);
  let graphList = chartdata(getMultipleMeasurements.getMultipleMeasurements);
  let allMetircs = getMultipleMeasurements.getMultipleMeasurements;

  let num = allMetircs.map((eachMetrics: itemObj) => {
    let areas = eachMetrics.metric;
    return areas;
  });
  let colorsObj: itemObj = {
    watertemp: '#880000',
    flareTemp: '#A5DD33',
    oilTemp: '#DC143C',
    casingPressure: '#732A5D',
    tubingPressure: '#00C300',
    injValvOpen: '#FF0000',
  };
  let area = num.map((metrics: string) => {
    return (
      <Line
        type="monotone"
        key={metrics}
        dot={false}
        stroke={colorsObj[metrics]}
        dataKey={metrics}
        activeDot={{ r: 0 }}
      />
    );
  });

  let input: itemObj[] = [];
  if (sel.selectedItem) {
    sel.selectedItem.forEach(item => {
      let iobj: itemObj = {};
      iobj.metricName = item.value;
      iobj.after = timeCurrent - 1800000;
      iobj.before = timeCurrent;
      input.push(iobj);
    });
  }

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
    pollInterval: 1300,
    requestPolicy: 'network-only',
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    dispatch(actions.metricsDataRecevied(data));
  }, [dispatch, data, error]);

  if (fetching) return <CircularProgress color="inherit"/>;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Provider value={client}>
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={400}
            data={graphList}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="at" />
            <YAxis />
            <Tooltip />
            {area}
          </LineChart>
        </ResponsiveContainer>
      </Provider>
    </div>
  );
};
