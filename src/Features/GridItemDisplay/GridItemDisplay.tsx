import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { GridChartDisplay } from '../GridChartDisplay/GridChartDisplay';
import IdItemTemp from '../IdItemTemp/IdItemTemp';
import { IState } from '../../store';
import Select from 'react-select';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMetrics
}
`;

interface optInt {
  value: string;
  label: string;
}

interface IitemObject {
  label: number;
  value: number;
}
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(2),
  },
  container: {
    display: 'flex',
    flexDirection: 'row'
  },
  dropdown: {
    minWidth: '100%',
    display: 'inline-flex',
    margin: '0 auto',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  gridcontainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  flexcolumn: {
    flexDirection: 'column',
    display: 'flex',
  },
  spacing: {
    padding: theme.spacing(2),
    textAlign: 'center',
    minHeight: '60vh',
    minWidth: '100%',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    flex: '1',
  },
}));


interface Itate {
  selectedItem: IitemObject[];
}
export type lType = {
  getMetrics: any;
};
export interface itemObj {
  [key: string]: any;
}
export interface Listarr {
  [index: number]: { label: string; value: string };
}

const getListDisplay = (state: IState) => {
  return state.gridItemD;
};

export default () => {
  return (
    <Provider value={client}>
      <GridItem />
    </Provider>
  );
};
const GridItem: React.FC = () => {
  const classes = useStyles();
  let [selectedItem, onSelectedItem] = useState<itemInt[]>([]);

  const dispatch = useDispatch();
  const listData: itemObj = useSelector(getListDisplay);
  const opt: lType = listData.getMetrics;
  const optArr: string[] = opt.getMetrics;
  let optionsList: optInt[] = [];

  if (optArr) {
    optArr.forEach((item: any) => {
      optionsList.push({ label: item, value: item });
    });
  }

  type MyOption = { label: string; value: number };
  type MyOptionType = { label: string; value: number };
  interface itemInt {
    label?: string | null;
    value?: string | null;
  }

  type itemType = itemInt[];

  const selectt = (val?: any) => {
    if (val) {
      let valuee: itemInt[] = val;
      // let arrayselc: itemType = [];
      onSelectedItem(valuee);
    } else {
      onSelectedItem([]);
    }
  };

  type OptionType = { label: string; value: number };
  let listofEquipments = <Select options={optionsList} isMulti onChange={selectt} />;

  const [result] = useQuery({
    query,
  });
  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.equipmentsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const getMetrics = data;
    dispatch(actions.equipmentsListDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container>
        <Grid container spacing={3}>
     
          {selectedItem.length > 0 ? (
            <Grid item xs={7} className={classes.gridcontainer}>
              {selectedItem.map((item, index) => {
                return (
                  <Grid item key={index} xs={5} spacing={2}>
                    <Paper className={classes.paper}>
                      <IdItemTemp selectedItem={item.value}></IdItemTemp>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : null}
               <Grid item xs={4} >
            <Box textAlign="left">
              <Paper className={classes.dropdown}>{listofEquipments}</Paper>
            </Box>
          </Grid>
          {selectedItem.length > 0 ? (
            <Grid item xs={12} className={classes.flexcolumn}>
              <Paper className={classes.spacing}>
                <GridChartDisplay selectedItem={selectedItem}></GridChartDisplay>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </Container>
    </div>
  );
};
