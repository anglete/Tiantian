
/**
 * @providesModule IndexAction
 */

import BaseAction from 'BaseAction';
import HttpUtil from 'HttpUtil';
import Config from 'Config';
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
	async getList(page, keyWord) {
		if (!page || page < 0) {
			page = 1;
		}
		if (keyWord === undefined || keyWord === null) {
			keyWord = '';
		}
		const result = await HttpUtil.get('/article/list', {
			page,
			text: keyWord,
			limit:Config.getConfig('page.size')
		});

		if (!result.ok) {
			console.log('get list error status=' + result.status);
			return this.dispatch(ActionType.INDEX_GET_LIST, []);
		}

		const res = result.json;
		if (res.code !== '1') {
			console.log('get list error code=' + res.code);
			return this.dispatch(ActionType.INDEX_GET_LIST, []);
		}
		const data = res.result;
		this.dispatch(ActionType.INDEX_GET_LIST, data);

	}

}
