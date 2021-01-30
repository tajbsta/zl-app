import { h } from 'preact';
import { route, Router } from 'preact-router';
import { Provider } from 'react-redux';

import { Grommet, Main, ResponsiveContext } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';

import store from './redux/store';

import { hasPermission } from './components/Authorize/index'

import zoolifeTheme from './style/theme';

import Header from './components/Header';
import AdminRouter from './shared/AdminRouter';
import DesignSystem from './routes/designSystem';
import Login from './routes/login';
import Signup from './routes/signup';
import Map from './routes/map';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';
import Plans from './routes/plans';

const customBreakpoints = deepMerge(grommet, zoolifeTheme)

const App = () => {
  const verifyRoutePermission = ({ active }) => {
    const [{ props: { permission } }] = active;

    if (!permission || hasPermission(permission)) {
      return;
    }

    route('/', true);
  }

  return (
    <Provider store={store}>
      <Grommet full theme={customBreakpoints} >
        <ResponsiveContext.Consumer>
          {(size) => (
            <>
              <Header />
              <Main fill={size === 'large'} pad={{ top: '60px' }}>
                <Router onChange={verifyRoutePermission}>
                  <Home path="/" exact />
                  <Habitat path="/habitat" permission="habitat:view" />
                  <DesignSystem path="/design" />
                  <Signup path="/signup" />
                  <Login path="/login" />
                  <AdminRouter path="/admin/:*" />
                  <Plans path="/plans" />
                  <Map path="/map" permission="map:view" />
                </Router>
              </Main>
            </>
          )}
        </ResponsiveContext.Consumer>
      </Grommet>
    </Provider>
  );
};
export default App;
