/**
 * Created by zhangyuan on 17/4/4.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';

import {
    FormLabel,
    FormInput,
    Button,
    Grid,
    Row,
    Col
} from 'react-native-elements'

import {AudioRecorder, AudioUtils} from 'react-native-audio';

import SetKeyAction from 'SetKeyAction';
import KeyWordsStore from 'KeyWordsStore';
import Util from 'Util';
import Consts from 'Consts';


export default class SetKey extends Component {
  static navigationOptions = {
    title: '设置搜索关键字'
  };

  constructor() {
    super();
    const temp = new Date().getTime();
    this.state = {
      pageStatus: 10, // 10：文本输入， 20：语音输入， 21：语音输入处理页面， 22：语音输入结果确认页面
      audioResult: {},
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      finished: false,
      audioPath: AudioUtils.DocumentDirectoryPath + '/rn_rec_' + temp + '.aac',
      hasPermission: undefined
    };
  }

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "High",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 16000
    });
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'AudioExample needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
        .then((result) => {
          console.log('Permission result:', result);
          return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
        });
  }


  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return null;
    }

    this.setState({stoppedRecording: true, recording: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.log(error);
    }
  }

  async _record() {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }


  _finishRecording(didSucceed, filePath) {
    this.setState({finished: didSucceed});
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
  }


  componentWillMount() {
    KeyWordsStore.addListener(Consts.KEY_EVENT_SET_AUDIO_KEY_WORD, this._confirmAudioKeyWord.bind(this));
  }

  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({hasPermission});

      if (!hasPermission) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    });
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

  /**
   *
   * @private
   */
  _longPress() {
    this._record();
  }

  /**
   *
   * @private
   */
  _onPressIn() {
    console.log('onPressIn');
  }

  /**
   *
   * @private
   */
  async _onPressOut() {
    const filePath = await this._stop();
    if (filePath !== null) {
      this.setState(Util.mix(this.state, {pageStatus: 21}));
      await SetKeyAction.setAudioKey(this.state.audioPath);
    }
  }

  /**
   *
   * @private
   */
  async _submit() {
    const keyWordValue = this.state.keyWordValue;
    if (keyWordValue) {
      await SetKeyAction.setKey(keyWordValue);
      const { goBack } = this.props.navigation;
      goBack();
    }
  }

  /**
   *
   * @private
   */
  async _toAudio() {
    this.setState(Util.mix(this.state, {
      pageStatus: 20
    }));
  }

  /**
   *
   * @private
   */
  async _toText() {
    this.setState(Util.mix(this.state, {
      pageStatus: 10
    }));
  }

  /**
   *
   * @param audioResult
   * @private
   */
  _confirmAudioKeyWord(audioResult) {
    const {result} = audioResult;
    let keyWordValue;
    if (result) {
      keyWordValue = result.text;
    }
    this.setState(Util.mix(this.state, {
      pageStatus: 22,
      audioResult,
      keyWordValue
    }));
  }


  render() {
    if (this.state.pageStatus === 10) {
      return (
          <Grid>
            <Row>
              <Col>
                <Button icon={{name: 'cached'}} title='语音'
                        onPress={this._toAudio.bind(this)}
                    />
              </Col>
              <Col>
                <FormInput ref='keyWordInput' placeholder='输入关键字'
                           onChangeText={(value) => this.state.keyWordValue=value}/>
              </Col>
              <Col>
                <Button icon={{name: 'cached'}} title='提交'
                        onPress={this._submit.bind(this)}
                    />
              </Col>
            </Row>
          </Grid>
      );
    }

    if (this.state.pageStatus === 20) {
      return (
          <View style={styles.container}>
            <TouchableHighlight
                onLongPress={this._longPress.bind(this)}
                onPressIn={this._onPressIn.bind(this)}
                onPressOut={this._onPressOut.bind(this)}
                >
              <Text style={styles.welcome}>
                点击录制关键词
              </Text>
            </TouchableHighlight>
            <Text style={styles.instructions}>
              请录音您要搜索的关键词
            </Text>
            <Text style={styles.instructions}>
              录音时间不要超过30s哟
            </Text>
            <TouchableHighlight
                onPress={this._toText.bind(this)}
                >
              <Text style={styles.instructions}>
                点击返回文字输入
              </Text>
            </TouchableHighlight>
          </View>
      );
    }

    if (this.state.pageStatus === 21) {
      return (
          <View>
            <ActivityIndicator
                animating={true}
                style={{height: 80}}
                size="large"
                />
            <Text style={styles.welcome}>
              处理中...
            </Text>
          </View>
      );
    }

    if (this.state.pageStatus === 22) {
      const {code, result} = this.state.audioResult;
      let view = null;
      if (code === '1') {
        view = (
            <View>
              <View>
                <Text style={styles.instructions}>
                  请问您说的是：
                </Text>
                <Text style={styles.instructions}>
                  {result.sentence}
                </Text>
                <Text style={styles.instructions}>
                  吗？
                </Text>
              </View>
              <View>
                <Text style={styles.welcome}>
                  设置的关键字为：
                </Text>
                <Text style={styles.welcome}>
                  {result.text}
                </Text>
              </View>
            </View>
        );
      } else {
        view = (
            <View>
              <Text style={styles.instructions}>
                抱歉！我没听懂你说什么。。。
              </Text>
            </View>
        );
      }
      return (
          <View>
            {view}
            <View>
              <Button icon={{name: 'cached'}} title='确定'
                      onPress={this._submit.bind(this)}
                  />
              <Button icon={{name: 'cached'}} title='重新设置'
                      onPress={this._toAudio.bind(this)}
                  />
            </View>
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
});

