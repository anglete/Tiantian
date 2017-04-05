
 /**
  * @providesModule BaseAction
  */

import Dispatcher from 'Dispatcher';

export default class {
	constructor() {
	 this.Dispatcher = Dispatcher;
	}

	dispatch(actionType, data) {
		this.Dispatcher.dispatch({
			actionType,
			data
		});
	}
}