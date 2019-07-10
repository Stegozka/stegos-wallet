// @flow
import React, { PureComponent } from 'react';
import type { AccountsStateType } from '../../../reducers/types';
import Button from '../../common/Button/Button';
import Icon from '../../common/Icon/Icon';
import AccountItem from './AccountItem/AccountItem';
import styles from './AccountsList.css';

type Props = {
  accounts: AccountsStateType,
  getKeys: () => void
};

export default class AccountsList extends PureComponent<Props> {
  componentDidMount(): void {
    const { getKeys } = this.props;
    getKeys();
  }

  render() {
    const { accounts } = this.props;
    return (
      <div className={styles.AccountsList}>
        <div className={styles.SearchBar}>
          <div className={styles.SearchFiledWrapper}>
            <input className={styles.SearchInput} placeholder="Search" />
            <Icon name="search" size={24} />
          </div>
          <Button icon="add" type="FilledPrimary" elevated>
            Add account
          </Button>
        </div>
        <div className={styles.Header}>
          <span className={styles.Title}>Accounts</span>
          <div className={styles.SortSelectorContainer}>
            <span
              className={`${styles.SortSelectorText} ${
                styles.SortSelectorLabel
              }`}
            >
              Sort by:
            </span>
            <select
              className={`${styles.SortSelectorText} ${styles.SortSelector}`}
              defaultValue="balance"
            >
              <option value="balance">Account balance</option>
              <option value="name">Account name</option>
            </select>
          </div>
        </div>
        <div className={styles.Accounts}>
          {accounts.accounts.map(account => (
            <AccountItem account={account} key={account.id} />
          ))}
        </div>
      </div>
    );
  }
}
