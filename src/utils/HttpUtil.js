
 /**
  * @providesModule HttpUtil
  */

import Config from 'Config';

export default new class {

	 /**
		*
		*/
  async get(url, params = {} , headers = {'Content-type': 'application/json'}, options = {'Response-type': 'json'}) {
		 url = this.buildUrl(url);
		 url = this.buildQueryString(url, params);
		 const response = await fetch(url, {
			headers,
			method: 'GET'
		});
		 return await this.buildResponse(response, options);
	}

	 /**
		*
		*/
	 async post(url, params = {} , headers = {'Content-type': 'application/json'}) {
		 url = this.buildUrl(url);
		 const response = await fetch(url, {
			 headers,
			 method: 'POST',
			 body:JSON.stringify(params)
		 });
		 return await this.buildResponse(response);
	 }

	 /**
		*
		*/
	 async buildResponse(response, options) {
		 const _status = response.status >> 0;
		 let _text = null;
		 let _json = null;
		 try {
			 if (options['Response-type'] === 'json') {
				 _json = await response.json();
			 }else {
				 _text = await response.text();
			 }
		 } catch(e) {
			 console.log(e);
		 }
		 return {
			 status: _status,
			 text: _text,
			 json: _json,
			 ok: 200 <=_status && _status <= 399
		 };
	 }

	 /**
		*
		*/
	buildUrl(url) {
		if (url.startsWith('http')) {
			return url;
		}
		return `${Config.getConfig('base.url')}${url}`;
	}

	 /**
		*
		*/
	 buildQueryString(url, params) {
		 const paramsArray = [];
		 //拼接参数
		 Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
		 if (url.search(/\?/) === -1) {
			 url += '?' + paramsArray.join('&')
		 } else {
			 url += '&' + paramsArray.join('&')
		 }
		 return url;
	 }
};