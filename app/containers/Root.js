// @flow
import { ConnectedRouter } from 'connected-react-router';
import { remote } from 'electron';
import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import BootstrapRoutes from '../BootstrapRoutes';
import type { AppStateType, Store } from '../reducers/types';
import Routes from '../Routes';
import '../utils/extended';
import menu from '../contextMenu';
import IntlProviderWrapper from '../components/i18n/IntlContext';
import Error from '../components/Error/Error';

type Props = {
  store: Store,
  history: {},
  app: AppStateType,
  error: string
};

class Root extends Component<Props> {
  componentDidMount() {
    window.addEventListener(
      'contextmenu',
      e => {
        e.preventDefault();
        // disable "copy" menu item when nothing is selected
        const selectedText = window.getSelection().toString();
        const copyMenuItem = menu.getMenuItemById('copy');
        copyMenuItem.enabled = !!selectedText;
        // disable paste menu item when clicked outside textfield
        const { activeElement } = document;
        const pasteMenuItem = menu.getMenuItemById('paste');
        pasteMenuItem.enabled =
          activeElement.nodeName === 'INPUT' ||
          activeElement.nodeName === 'TEXTAREA';
        menu.popup({ window: remote.getCurrentWindow() });
      },
      false
    );
  }

  renderApp() {
    const { history, app } = this.props;
    return app.isBootstrappingComplete ? (
      <React.Fragment>
        <ConnectedRouter history={history}>
          <Routes />
        </ConnectedRouter>
      </React.Fragment>
    ) : (
      <ConnectedRouter history={history}>
        <BootstrapRoutes />
      </ConnectedRouter>
    );
  }

  render() {
    const { store, error } = this.props;
    return (
      <Provider store={store}>
        <IntlProviderWrapper>
          {error ? <Error error={error} /> : this.renderApp()}
        </IntlProviderWrapper>
      </Provider>
    );
  }
}

export default connect(state => ({
  app: state.app,
  error: state.node.error
}))(Root);
