/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} from 'react-native';
//
import {
    Button,
    Grid,
    Row,
    Col,
    Tile
} from 'react-native-elements';

import IndexStore from 'IndexStore';
import KeyWordsStore from 'KeyWordsStore';
import Consts from 'Consts';
import Util from 'Util';
import List from './list';

import Keywords from './keywords';

export default class Index extends Component {

  static navigationOptions = {
    title: '首页'
  };

  constructor() {
    super();
    this.state = {
      keyWords: []
    };
  }

  async componentWillMount() {
    KeyWordsStore.addListener(Consts.KEY_EVENT_CHANGE_KEY_WORD, this.__refreshPage.bind(this));
    const keyWords = await KeyWordsStore.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS, []);
    this.setState(Util.mix(this.state, {keyWords}));
  }

  componentDidMount() {
  }

  /**
   * runtime
   */
  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  /**
   * destroy
   */
  componentWillUnmount() {
    KeyWordsStore.removeListener(Consts.KEY_EVENT_CHANGE_KEY_WORD);
  }

  /**
   *
   * @private
   */
  async __refreshPage() {
    const keyWords = await KeyWordsStore.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS, []);
    this.setState(Util.mix(this.state, {keyWords}));
    if (this.__keyWordPanel) {
      this.__keyWordPanel.hide();
    }
  }

  /**
   *
   * @private
   */
  __showKeywordsPanel() {
    if (this.__keyWordPanel) {
      this.__keyWordPanel.show();
    }
  }


  render() {
    const keyWords = this.state.keyWords || [];
    let keyWordStr = '';
    for (const keyWord of keyWords) {
      keyWordStr += `${keyWord} `;
    }
    keyWordStr = keyWordStr.replace(/\s$/, '');

    const rows = [];
    rows.push(
        <Row size={10} containerStyle={styles.container}>
          <Col size={100} containerStyle={styles.keywordContainer}>
            <Text >{keyWordStr}</Text>
          </Col>
          <Col size={5}>
            <TouchableHighlight onPress={this.__showKeywordsPanel.bind(this)}>
              <Text>＋</Text>
            </TouchableHighlight>
          </Col>
        </Row>
    );

    rows.push(<Row size={90}>
      <Col>
        <List keyWord={keyWordStr} navigation={this.props.navigation}/>
      </Col>
    </Row>);

    return (
        <Grid containerStyle={styles.container}>
          {rows}
          <Keywords ref={c => this.__keyWordPanel=c} navigation={this.props.navigation}/>
        </Grid>
    );
  }
}

const styles = StyleSheet.create({
  grid: {
    padding:5
  },
  container: {
    flex: 3,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    height: 30
  },
  keywordContainer: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginBottom:0,
  }
});
