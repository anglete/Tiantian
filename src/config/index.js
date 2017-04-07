
 /**
  * @providesModule Config
  */

const config = {
	'page.size': 20,
	'base.url': 'http://app1.hkn.tinfinite.com'
}


export default {
	getConfig(key) {
		return config[key];
	}
}