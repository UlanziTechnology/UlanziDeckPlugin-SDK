class UlanziUtils {


	/**
	 * 获取表单数据
	 * Returns the value from a form using the form controls name property
	 * @param {Element | string} form
	 * @returns
	 */
	getFormValue(form) {
		if (typeof form === 'string') {
			form = document.querySelector(form);
		}

		const elements = form?.elements;

		if (!elements) {
			console.error('Could not find form!');
		}

		const formData = new FormData(form);
		let formValue = {};

		formData.forEach((value, key) => {
			if (!Reflect.has(formValue, key)) {
				formValue[key] = value;
				return;
			}
			if (!Array.isArray(formValue[key])) {
				formValue[key] = [formValue[key]];
			}
			formValue[key].push(value);
		});

		return formValue;
	}

	/**
	 * 重载表单数据
	 * Sets the value of form controls using their name attribute and the jsn object key
	 * @param {*} jsn
	 * @param {Element | string} form
	 */
	setFormValue(jsn, form) {
		if (!jsn) {
			return;
		}

		if (typeof form === 'string') {
			form = document.querySelector(form);
		}

		const elements = form?.elements;

		if (!elements) {
			console.error('Could not find form!');
		}

		Array.from(elements)
			.filter((element) => element?.name)
			.forEach((element) => {
				const { name, type } = element;
				const value = name in jsn ? jsn[name] : null;
				const isCheckOrRadio = type === 'checkbox' || type === 'radio';

				if (value === null) return;

				if (isCheckOrRadio) {
					const isSingle = value === element.value;
					if (isSingle || (Array.isArray(value) && value.includes(element.value))) {
						element.checked = true;
					}
				} else {
					element.value = value ?? '';
				}
			});
	}

	/**
	 * 防抖
	 * This provides a slight delay before processing rapid events
	 * @param {function} fn
	 * @param {number} wait - delay before processing function (recommended time 150ms)
	 * @returns
	 */
	debounce(fn, wait = 150) {
		let timeoutId = null
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				fn.apply(null, args);
			}, wait);
		};
	}



  /**
	 * JSON.parse优化
   * parse json
   * @param {string} jsonString
   * @returns {object} json
  */
  parseJson(jsonString) {
    if (typeof jsonString === 'object') return jsonString;
    try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === 'object') {
            return o;
        }
    } catch (e) {}

    return false;
  }



	/**
   * 获取接口数据
   * @param {string} url 接口地址
	 * @param {object} param 接口参数
	 * @param {string} method 请求方式：GET/POST/PUT/DELETE
	 * @param {object} headers 请求头
   */
	fetchData = function(url, param, method = 'GET', headers = {}){

		if (method.toUpperCase() === 'GET') {
			param = Object.assign(param || {}, Utils.joinTimestamp());

			//若参数有数组，进行特殊拼接
			url =  url + '?' + Object.keys(param).map(e => {
				let str = ''
				//判断数组拼接
				if(param[e] instanceof Array){
					str = param[e].map((item)=>{
						return `${e}=${item}`
					}).join('&')
				}else{
					str = `${e}=${param[e]}`
				}
				return str
			}).join('&');
		}
	
		const opts = {
			cache: 'no-cache',
			headers,
			method: method,
			body: ['GET', 'HEAD'].includes(method)
				? undefined
				: param,
		};
		return new Promise(function (resolve, reject) {
			Utils.fetchWithTimeout(url, opts)
				.then(async (resp) => {
					console.log('===resp',resp)
					if (!resp) {
						reject(new Error('No Resp'));
					}
					if (!resp.ok) {
						const errData = await resp.json();
						console.log('===resp.data',errData)
						if(errData){
							reject(errData) ;
						}else{
							reject(new Error(`{${resp.status}: ${await resp.text()}}`)) ;
						}
	
					}else{
						resolve(await resp.json());
					}
				})
				.catch((err) => {
					reject(err); 
				})
		});
	}

	/**
   * 封装fetch请求，设置超时时间
   */
	fetchWithTimeout = (url, options = {}) => {
		const { timeout = 8000 } = options; // 设置默认超时时间为8000ms
	 
		const controller = new AbortController();
		const id = setTimeout(() => controller.abort(), timeout);
	 
		const response = fetch(url, {
			...options,
			signal: controller.signal
		}).then((response) => {
			clearTimeout(id);
			return response;
		}).catch((error) => {
			clearTimeout(id);
			throw error;
		});
	 
		return response;
	
	}

	/**
   * 获取随机时间戳
   */
	joinTimestamp(){
		const now = new Date().getTime();
		return { _t: now };
	}

  /**
   * Logs a message 
   * @param {any} msg
   */
  log(...msg){
    console.log(`[${new Date().toLocaleString('zh-CN', {hour12: false})}]`, ...msg);
  }

  /**
   * Logs a warning message 
   */
  warn(...msg){
    console.warn(`[${new Date().toLocaleString('zh-CN', {hour12: false})}]`, ...msg);
  }

	/**
	 * Logs an error message
	*/
	error(...msg){
		console.error(`[${new Date().toLocaleString('zh-CN', {hour12: false})}]`, ...msg);
	}
}
const Utils = new UlanziUtils();
export default Utils