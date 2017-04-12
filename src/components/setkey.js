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
import {AudioRecorder, AudioUtils} from 'react-native-audio';

import SetKeyAction from 'SetKeyAction';
import Util from 'Util';


export default class SetKey extends Component {
  static navigationOptions = {
    title: '设置搜索关键字'
  };

  constructor() {
    super();
    const temp = new Date().getTime();
    this.state = {
      loading: false,
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
      this.setState(Util.mix(this.state, {loading: true}));
      await SetKeyAction.setKey(this.state.audioPath);
      const { goBack } = this.props.navigation;
      goBack();
    }
  }

  render() {
    if (this.state.loading) {
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
        </View>
    );
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

