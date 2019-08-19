// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../common/Button/Button';
import Input from '../common/Input/Input';
import Modal from '../common/Modal/Modal';
import styles from './WalletSettings.css';
import type { AppStateType } from '../../reducers/types';
import * as AppActions from '../../actions/settings';

type Props = {
  app: AppStateType,
  visible: boolean,
  onCloseRequest: () => void,
  changePassword: () => void,
  setAutoLockTimeout: () => void,
  intl: any
};

const noErrorsState = {
  oldPasswordError: '',
  newPasswordError: '',
  newPasswordRepeatError: '',
  autoLockTimeoutError: ''
};

const initialState = {
  oldPassword: '',
  newPassword: '',
  newPasswordRepeat: '',
  ...noErrorsState
};

class WalletSettings extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    const { app } = props;
    const { autoLockTimeout } = app;
    this.state = {
      ...initialState,
      autoLockTimeout
    };
  }

  handleInputChange(event) {
    const { target } = event;
    const { name, value } = target;
    this.setState({
      [name]: value,
      ...noErrorsState
    });
  }

  handleAutoLockTimeoutChange = event => {
    this.setState({
      autoLockTimeout: event.target.value,
      autoLockTimeoutError: ''
    });
  };

  reset = () => {
    this.setState({
      ...initialState
    });
  };

  resetAll = () => {
    const { app } = this.props;
    const { autoLockTimeout } = app;
    this.setState({
      ...initialState,
      autoLockTimeout
    });
  };

  apply() {
    if (this.validate()) {
      const { changePassword, setAutoLockTimeout } = this.props;
      const {
        oldPassword,
        newPassword,
        newPasswordRepeat,
        autoLockTimeout
      } = this.state;
      if (newPasswordRepeat && newPasswordRepeat.length > 0)
        changePassword(newPassword, oldPassword)
          .then(resp => {
            if (autoLockTimeout) setAutoLockTimeout(autoLockTimeout);
            this.reset();
            this.close();
            return resp;
          })
          .catch(console.log);
      else {
        if (autoLockTimeout) setAutoLockTimeout(autoLockTimeout);
        this.reset();
        this.close();
      }
    }
  }

  cancel() {
    this.resetAll();
    this.close();
  }

  close = () => {
    const { onCloseRequest } = this.props;
    onCloseRequest();
  };

  validate = (): boolean => {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      autoLockTimeout
    } = this.state;
    const { app, intl } = this.props;
    const { isPasswordSet } = app;
    if (oldPassword !== '' || newPassword !== '') {
      if (isPasswordSet && oldPassword === '') {
        this.setState({
          oldPasswordError: intl.formatMessage({
            id: 'input.error.old.password.required'
          })
        });
        return false;
      }
      if (newPassword === '') {
        this.setState({
          newPasswordError: intl.formatMessage({
            id: 'input.error.new.password.required'
          })
        });
        return false;
      }
    }
    if (newPasswordRepeat !== newPassword) {
      this.setState({
        newPasswordRepeatError: intl.formatMessage({
          id: 'input.error.password.does.not.match'
        })
      });
      return false;
    }
    if (!/^\d*$/.test(autoLockTimeout) || +autoLockTimeout < 1) {
      this.setState({
        autoLockTimeoutError: intl.formatMessage({
          id: 'input.error.invalid.value'
        })
      });
      return false;
    }
    return true;
  };

  render() {
    const {
      oldPassword,
      newPassword,
      newPasswordRepeat,
      oldPasswordError,
      newPasswordError,
      newPasswordRepeatError,
      autoLockTimeout,
      autoLockTimeoutError
    } = this.state;
    const { visible, app, intl } = this.props;
    const { isPasswordSet } = app;
    return (
      <Modal
        options={{
          title: intl.formatMessage({ id: 'wallet.settings.title' }),
          subtitle: intl.formatMessage({ id: 'wallet.settings.subtitle' }),
          type: 'big',
          visible,
          onClose: this.cancel.bind(this)
        }}
        style={{ width: '55%' }}
      >
        <div className={styles.Container}>
          {isPasswordSet && (
            <Input
              placeholder={intl.formatMessage({
                id: 'input.name.old.password'
              })}
              value={oldPassword}
              name="oldPassword"
              onChange={e => this.handleInputChange(e)}
              className={styles.Input}
              type="password"
              error={oldPasswordError}
              errorOutside
              showError
            />
          )}
          <Input
            placeholder={intl.formatMessage({ id: 'input.name.password' })}
            value={newPassword}
            name="newPassword"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
            error={newPasswordError}
            errorOutside
            showError
          />
          <Input
            placeholder={intl.formatMessage({
              id: 'input.name.confirm.password'
            })}
            value={newPasswordRepeat}
            name="newPasswordRepeat"
            onChange={e => this.handleInputChange(e)}
            className={styles.Input}
            type="password"
            error={newPasswordRepeatError}
            errorOutside
            showError
          />
          <div className={styles.AutoLockContainer}>
            <span className={styles.AutoLockLabel}>
              <FormattedMessage id="wallet.settings.lock.title" tagName="b" />{' '}
              <FormattedMessage id="wallet.settings.lock.description" />
            </span>
            <Input
              name="autoLockTimeout"
              value={autoLockTimeout}
              type="number"
              error={autoLockTimeoutError}
              showError
              onChange={this.handleAutoLockTimeoutChange}
              className={styles.AutoLockInput}
              noLabel
            />
            <span className={styles.AutoLockPostfix}>
              <FormattedMessage id="wallet.settings.minutes" />
            </span>
          </div>
        </div>
        <div className={styles.ActionsContainer}>
          <Button type="OutlineDisabled" onClick={() => this.cancel()}>
            <FormattedMessage id="button.cancel" />
          </Button>
          <Button type="OutlinePrimary" onClick={() => this.apply()}>
            <FormattedMessage id="button.apply" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default connect(
  state => ({ app: state.app }),
  dispatch => bindActionCreators(AppActions, dispatch)
)(injectIntl(WalletSettings));
