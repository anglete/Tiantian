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
    if (this.__keyWordPannel) {
      this.__keyWordPannel.hide();
    }
  }

  /**
   *
   * @private
   */
  __showKeywordsPannel() {
    if (this.__keyWordPannel) {
      this.__keyWordPannel.show();
    }
  }


  render() {
    const keyWords = this.state.keyWords || [''];
    let keyWordStr = '';
    for (const keyWord of keyWords) {
      keyWordStr += `${keyWord} `;
    }
    keyWordStr = keyWordStr.replace(/\s$/, '');

    const rows = [];
    rows.push(
        <Row size={5}>
          <Col size={100}>
            <Text>{keyWordStr}</Text>
          </Col>
          <Col size={5}>
            <TouchableHighlight onPress={this.__showKeywordsPannel.bind(this)}>
              <Text>＋</Text>
            </TouchableHighlight>
          </Col>
        </Row>
    );

    rows.push(<Row size={95}>
      <Col>
        <List keyWord={keyWordStr} navigation={this.props.navigation}/>
      </Col>
    </Row>);

    return (
        <Grid>
          {rows}
          <Keywords ref={c => this.__keyWordPannel=c} navigation={this.props.navigation}/>
        </Grid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
