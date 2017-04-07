/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
//
import {
    Button,
    Grid,
    Row,
    Col
} from 'react-native-elements';

import IndexStore from 'IndexStore';
import Consts from 'Consts';
import Util from 'Util';
import List from './list';

export default class Index extends Component {

  static navigationOptions = {
    title: '首页'
  };

  constructor() {
    super();
    const keyWord = IndexStore.load(Consts.KEY_STORAGE_KEY_WORD) || '';
    this.state = {
      keyWord
    };
  }

  componentWillMount() {
    IndexStore.addListener(Consts.KEY_EVENT_CHANGE_KEY_WORD, this.__refreshPage.bind(this));
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
    IndexStore.removeListener(Consts.KEY_EVENT_CHANGE_KEY_WORD);
  }

  __refreshPage(data) {
    this.setState(Util.mix(this.state, {keyWord: data}));
  }


  render() {
    const { navigate } = this.props.navigation;
    const keyWord = this.state.keyWord;

    return (
        <Grid>
          <Row size={5}>
            <Col><Text>{keyWord ? '当前搜索关键词：' + keyWord : '当前未设置搜索关键词'}</Text></Col>
            <Col><Button icon={{name: 'cached'}} title='设置搜索关键词'
                         onPress={() => navigate('SetKey')}
                /></Col>
          </Row>

          <Row size={95}>
              <Col>
                <List keyWord={keyWord} navigation={this.props.navigation}/>
              </Col>
          </Row>
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
