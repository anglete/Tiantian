/**
 * Created by zhangyuan on 17/4/4.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {AudioRecorder, AudioUtils} from 'react-native-audio';

import SetKeyAction from 'SetKeyAction';


export default class SetKey extends Component {
  static navigationOptions = {
    title: '设置搜索关键字'
  };

  constructor() {
    super();
    const temp = new Date().getTime();
    this.state = {
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
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
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

  _renderButton(title, onPress, active) {
    var style = (active) ? styles.activeButtonText : styles.buttonText;

    return (
        <TouchableHighlight style={styles.button} onPress={onPress}>
          <Text style={style}>
            {title}
          </Text>
        </TouchableHighlight>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn('Can\'t pause, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false});

    try {
      const filePath = await AudioRecorder.pauseRecording();

      // Pause is currently equivalent to stop on Android.
      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState({stoppedRecording: true, recording: false});

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
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

    if(this.state.stoppedRecording){
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({recording: true});

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _doupload() {
    console.log('start uploading----->');
    const files = [{
      name: 'test',
      filename: 'upload.aac',
      filepath: this.state.audioPath,
      filetype: null,
    }];
    const options = {
      url: 'http://192.168.202.3:5050/sentence/text',
      files,
      method: 'POST',
    };
    RNUploader.upload(options, (err, response) => {
      if (err) {
        console.log('upload err--->', err)
        return;
      }
      console.log('response--->', response.data);
      Alert.alert(
          'Alert Title',
          response.data,
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]
      )
    });
  }

  _finishRecording(didSucceed, filePath) {
    this.setState({ finished: didSucceed });
    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath}`);
  }



  componentWillMount() {

  }

  componentDidMount() {
    const audioPath = AudioUtils.DocumentDirectoryPath + '/test.aac';
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac"
    });

    SetKeyAction.setKey('梅西');
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
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            搜索关键词设置
          </Text>
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

