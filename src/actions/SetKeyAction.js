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
  async setKey(keyWord) {
    this.dispatch(ActionType.INDEX_SET_KEY_WORD, keyWord);
  }

}

