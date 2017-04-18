/**
 * Created by zhangyuan on 17/4/15.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';

import {
    Button
} from 'react-native-elements';

//import TimerMixin from 'react-timer-mixin';

import SetKeyAction from 'SetKeyAction';
import KeyWordsStore from 'KeyWordsStore';
import Util from 'Util';
import Consts from 'Consts';

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [375, 600];
const [left, top] = [0, 0];
const [middleLeft, middleTop] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: width,
    height: height,
    left: left,
    top: top,
  },
  mask: {
    justifyContent: "center",
    backgroundColor: "#383838",
    opacity: 0.8,
    position: "absolute",
    width: width,
    height: height,
    left: left,
    top: top,
  },
  tip: {
    width: aWidth,
    height: aHeight,
    left: middleLeft,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipTitleView: {
    height: 20,
    //flexDirection:'row',
    //alignItems:'center',
    //justifyContent:'center',
    textAlign: 'right'
  },
  tipTitleText: {
    color: "#999999",
    fontSize: 14,
  },
  tipContentView: {
    width: aWidth,
    borderTopWidth: 0.5,
    borderColor: "#f0f0f0",
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    color: "#e6454a",
    fontSize: 17,
    textAlign: "center",
  },
  button: {
    height: 45,
    backgroundColor: '#fff',
    //borderColor: '#e6454a',
    //borderWidth: 1,
    //borderRadius: 4,
    alignSelf: 'stretch',
    justifyContent: 'center',
    //marginLeft: 10,
    //marginRight: 10,
  },
  buttonText: {
    fontSize: 17,
    color: "#e6454a",
    textAlign: "center",
  },
  gap: {
    height: 10,
    width: aWidth,
    backgroundColor: '#383838',
    opacity: 0.8,
  },
});

export default class KeyWords extends Component {
  //mixins = [TimerMixin];
  parent = {};

  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
      history: [],
      keyWords: [],
      hide: true
    };
  }

  async componentWillMount() {
    const keyWords = await KeyWordsStore.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS, []);
    const history = await KeyWordsStore.get(Consts.KEY_STORAGE_HISTORY_KEYWORDS, []);
    this.setState(Util.mix(this.state, {keyWords, history}));
  }

  _cancelKeyWord(keyWord) {
    SetKeyAction.cancelKey([keyWord]);
  }

  _setKeyWord(keyWord) {
    SetKeyAction.setKey([keyWord]);
  }

  render() {
    if (this.state.hide) {
      return (<View />)
    } else {
      const { navigate } = this.props.navigation;
      const {history, keyWords} = this.state;
      const hp = [];
      const kp = [];
      for (let keyWord of keyWords) {
        kp.push(
            <TouchableHighlight underlayColor='#f0f0f0' onLongPress={this._cancelKeyWord.bind(this, keyWord)}>
              <View><Text>{keyWord}</Text></View>
            </TouchableHighlight>
        );
      }

      for (let keyWord of history) {
        hp.push(
            <TouchableHighlight underlayColor='#f0f0f0' onLongPress={this._setKeyWord.bind(this, keyWord)}>
              <View><Text>{keyWord}</Text></View>
            </TouchableHighlight>
        );
      }
      return (
          <View style={styles.container}>
            <Animated.View style={ styles.mask }>
            </Animated.View>

            <Animated.View style={[styles.tip , {transform: [{
                translateY: this.state.offset.interpolate({
                 inputRange: [0, 1],
                 outputRange: [height, (height-aHeight -34)]
                }),
              }]
            }]}>
              <View>
                <Button icon={{name: 'cached'}} title='设置搜索关键词'
                        onPress={() => navigate('SetKey')}
                    />
                <TouchableHighlight underlayColor='#f0f0f0' onPress={this.out.bind(this)}>
                  <Text>✘</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.gap}/>
              <View>
                <View>
                  <Text>关键字</Text>
                </View>
                {kp}
              </View>
              <View>
                <View>
                  <Text>历史记录</Text>
                </View>
                {hp}
              </View>

            </Animated.View>
          </View>
      );
    }
  }

  componentDidMount() {

  }

  //显示动画
  in() {
    Animated.parallel([
      Animated.timing(
          this.state.opacity,
          {
            easing: Easing.linear,
            duration: 500,
            toValue: 0.8,
          }
      ),
      Animated.timing(
          this.state.offset,
          {
            easing: Easing.linear,
            duration: 500,
            toValue: 1,
          }
      )
    ]).start();
  }

  //隐藏动画
  out() {
    Animated.parallel([
      Animated.timing(
          this.state.opacity,
          {
            easing: Easing.linear,
            duration: 500,
            toValue: 0,
          }
      ),
      Animated.timing(
          this.state.offset,
          {
            easing: Easing.linear,
            duration: 500,
            toValue: 0,
          }
      )
    ]).start();

    setTimeout(
        () => this.setState({hide: true}),
        500
    );
  }

  //取消
  hide() {
    if (!this.state.hide) {
      this.out();
    }
  }

  //选择
  choose(msg) {
    if (!this.state.hide) {
      this.out();
    }
  }

  async show() {
    const keyWords = await KeyWordsStore.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS, []);
    const history = await KeyWordsStore.get(Consts.KEY_STORAGE_HISTORY_KEYWORDS, []);
    if (this.state.hide) {
      this.setState({keyWords, history, hide: false}, this.in);
    }
  }
}