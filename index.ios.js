/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import Index from './src/components/index';
import SetKey from './src/components/setkey';
import WebView from './src/components/webview';

const app = StackNavigator({
  Index: { screen: Index },
  SetKey: { screen: SetKey },
  Detail: {
    screen: WebView,
    path: 'article/:url'
  }
});


AppRegistry.registerComponent('test', () => app);
