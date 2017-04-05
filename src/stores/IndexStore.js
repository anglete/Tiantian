
/**
  * @providesModule IndexStore
  */

 import BaseStore from 'BaseStore';
 import ActinType from 'ActionType';
 import Consts from 'Consts';

 export default new class extends BaseStore {
 	constructor() {
 	  super();
 	}

 	 getDispatchRegister() {
 	 	return (action) => {
 	 		const actionType = action.actionType;
 	 		const data = action.data;
 	 		switch(actionType) {
 	 			case ActinType.INDEX_GET_LIST: {
 	 				return this.emit(Consts.KEY_EVENT_CHANGE, data);
 	 			}
				case ActinType.INDEX_SET_KEY_WORD: {
					this.store(Consts.KEY_STORAGE_KEY_WORD, data);
					return this.emit(Consts.KEY_EVENT_CHANGE_KEY_WORD, data);
				}
 	 		}
 	 	}
 	 }

 }
