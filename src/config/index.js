
 /**
  * @providesModule Config
  */

const config = {
	'page.size': 20,
	'base.url': 'http://app1.hkn.tinfinite.com',
	 'keywords.store.length': 5
};


export default {
	getConfig(key) {
		return config[key];
	}
}