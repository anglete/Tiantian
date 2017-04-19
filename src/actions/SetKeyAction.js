/**
 * @providesModule SetKeyAction
 */

/**
 * Created by zhangyuan on 17/4/4.
 */

import BaseAction from 'BaseAction';
import HttpUtil from 'HttpUtil';
import ActionType from 'ActionType'

export default new class extends BaseAction {
  constructor() {
    super();
  }

  /**
   *
   * @param page
   * @param keyWord
   * @returns {*}
   */
  async setAudioKey(filePath) {
    const res = await HttpUtil.uploadFile('/sentence/text', [filePath]);
    const result = res.json;
    this.dispatch(ActionType.KEY_WORDS_SET_AUDIO_KEY_WORDS, result);
  }

  /**
   *
   * @param keys
   */
  async setKey(keys) {
    if (!Array.isArray(keys)) {
      keys = keys.split(' '); // 多个key用空格分隔
    }
    this.dispatch(ActionType.KEY_WORDS_SET_KEY_WORDS, keys);
  }

  async cancelKey(keys) {
    if (!Array.isArray(keys)) {
      keys = keys.split(' '); // 多个key用空格分隔
    }
    this.dispatch(ActionType.KEY_WORDS_CANCEL_KEY_WORDS, keys);
  }
}

