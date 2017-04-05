/**
 * Created by zhangyuan on 17/4/4.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';

export default class SetKey extends Component {
  static navigationOptions = {
    title: '详情页'
  };
  constructor() {
    super();
    this.state = {
    };
  }

  componentWillMount() {

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

  }

  render() {
    const {params} = this.props.navigation.state;
    return (
        <View style={{flex:1}}>
          <WebView style={styles.webview_style}
                   url={params.url}
                   startInLoadingState={true}
                   domStorageEnabled={true}
                   javaScriptEnabled={true}
              >
          </WebView>
        </View>
    );
  }
}

var styles = StyleSheet.create({
  webview_style:{
    backgroundColor:'#00ff00',
  }
});

