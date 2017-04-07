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
  async setKey(filePath) {
    const res = await HttpUtil.uploadFile('/sentence/text', [filePath]);
    const keyWord = res.json.result;
    console.log(keyWord);
    this.dispatch(ActionType.INDEX_SET_KEY_WORD, keyWord);
  }

}

