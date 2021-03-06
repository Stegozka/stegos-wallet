import React, { Component } from 'react';
import Icon from '../Icon/Icon';
import styles from './Busy.css';

type Props = {
  state?: string,
  title?: string,
  visible?: boolean
};

export default class Busy extends Component<Props> {
  static getHighestZindex(): number {
    const elements = document.getElementsByTagName('*');
    const maxZ = Math.max.apply(
      null,
      Array.from(elements).map(
        element => parseInt(element.style.zIndex, 10) || 1
      )
    );
    return maxZ + 3;
  }

  static defaultProps = {
    state: null,
    title: '',
    visible: false
  };

  state = {
    zIndex: 0
  };

  componentDidMount() {
    this.setState({
      zIndex: Busy.getHighestZindex()
    });
  }

  render() {
    const { visible, title, state } = this.props;
    const { zIndex } = this.state;
    if (!visible) {
      return null;
    }
    return (
      <div className={styles.Busy} style={{ zIndex }}>
        {state && <span className={styles.Label}>{state}</span>}
        <Icon name="loop" size={48} className={styles.Rotate} />
        <span className={styles.Label}>{title}</span>
      </div>
    );
  }
}
