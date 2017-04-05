
 /**
  * @providesModule Config
  */

const config = {
	'page.size': 20,
	'base.url': 'http://192.168.202.3:5050'
}


export default {
	getConfig(key) {
		return config[key];
	}
}