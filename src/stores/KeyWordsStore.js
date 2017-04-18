/**
 * @providesModule KeyWordsStore
 */

import BaseStore from 'BaseStore';
import ActinType from 'ActionType';
import Consts from 'Consts';
import Config from 'Config';

export default new class extends BaseStore {
  constructor() {
    super();
  }

  async addKeyWords(keyWords) {
    const len = Config.getConfig('keywords.store.length');
    let currents = await this.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS) || [];
    let histories = await this.get(Consts.KEY_STORAGE_HISTORY_KEYWORDS) || [];
    for (let keyWord of keyWords) {
      const i = currents.indexOf(keyWord);
      if (i > -1) {
        currents.splice(i, 1);
      }
      currents.unshift(keyWord);

      const j = histories.indexOf(keyWord);
      if (j > -1) {
        histories.splice(j, 1);
      }
    }
    const length = currents.length;
    if (length > len) { // 超过长度
      const tail = currents.slice(len);
      currents = currents.slice(0, len);
      Array.prototype.unshift.apply(histories, tail);
    }
    if (histories.length > len) {
      histories = histories.slice(0, len);
    }
    await this.set(Consts.KEY_STORAGE_CURRENT_KEYWORDS, currents);
    await this.set(Consts.KEY_STORAGE_HISTORY_KEYWORDS, histories);
    return currents;
  }

  async cancelKeyWords(keyWords) {
    const len = Config.getConfig('keywords.store.length');
    let currents = await this.get(Consts.KEY_STORAGE_CURRENT_KEYWORDS) || [];
    let histories = await this.get(Consts.KEY_STORAGE_HISTORY_KEYWORDS) || [];
    for (let keyWord of keyWords) {
      const i = currents.indexOf(keyWord);
      if (i < 0) {
        continue;
      }
      currents.splice(i, 1);
      const j = histories.indexOf(keyWord);
      if (j < 0) {
        histories.unshift(keyWord);
      }
    }
    if (histories.length > len) {
      histories = histories.slice(0, len);
    }
    await this.set(Consts.KEY_STORAGE_CURRENT_KEYWORDS, currents);
    await this.set(Consts.KEY_STORAGE_HISTORY_KEYWORDS, histories);
    return currents;
  }

  getDispatchRegister() {
    return async (action) => {
      const actionType = action.actionType;
      const data = action.data;
      switch (actionType) {
        case ActinType.KEY_WORDS_SET_KEY_WORDS:
        {
          const currents = await this.addKeyWords(data);
          return this.emit(Consts.KEY_EVENT_CHANGE_KEY_WORD, currents);
        }
        case ActinType.KEY_WORDS_CANCEL_KEY_WORDS:
        {
          const currents = await this.cancelKeyWords(data);
          return this.emit(Consts.KEY_EVENT_CHANGE_KEY_WORD, currents);
        }
        case ActinType.KEY_WORDS_SET_AUDIO_KEY_WORDS:
        {
          return this.emit(Consts.KEY_EVENT_SET_AUDIO_KEY_WORD, data);
        }
      }
    }
  }

}

