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
    console.log(res.json);
    const keyWord = res.json.result;
    this.dispatch(ActionType.KEY_WORDS_SET_AUDIO_KEY_WORDS, {say:'请帮我搜索梅西', keyWord:'梅西'});
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

