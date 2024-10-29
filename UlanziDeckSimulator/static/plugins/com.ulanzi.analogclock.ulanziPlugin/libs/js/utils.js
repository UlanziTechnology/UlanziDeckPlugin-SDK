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

		const elements = form ? form.elements : '';

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

		const elements = form ? form.elements:'';

		if (!elements) {
			console.error('Could not find form!');
		}

		Array.from(elements)
			.filter((element) => element?element.name:null)
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
					element.value = value ? value : '';
				}
			});
	}

	/**
	 * 延迟触发
	 * This provides a slight delay before processing rapid events
	 * @param {function} fn
	 * @param {number} wait - delay before processing function (recommended time 150ms)
	 * @returns
	 */
	debounce(fn, wait = 150) {
		let timeoutId = null
		return (...args) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				fn.apply(null, args);
			}, wait);
		};
	}

  /**
   * 返回url的查询参数
  */
  getQueryParams(param) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param);
  }

  /**
	 * 获取浏览器语言
   * Returns the user language
  */
  getLanguage() {
    let userLanguage = navigator.languages && navigator.languages.length ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    if(userLanguage.indexOf('zh-') >= 0){
			userLanguage = userLanguage.split('-').join('_')
		}else if(userLanguage.indexOf('-') !== -1 ) {
      userLanguage = userLanguage.split('-')[0];
    }
    return userLanguage;
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
	 * 读取json文件
   * Reads a json file 
   * @param {string} path
   * @returns {Promise<any>} json
  */
  async readJson(path) {
    if(!path) {
        console.error('A path is required to readJson.');
    }

    return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.onerror = reject;
        req.overrideMimeType('application/json');
        req.open('GET', path, true);
        req.onreadystatechange = (response) => {
            if(req.readyState === 4) {
                const jsonString = response && response.target && response.target.response || '';
                if(jsonString) {
									try{
                    resolve(JSON.parse(jsonString));
									}catch(e){
                    reject();
									}
                } else {
                    reject();
                }
            }
        };

        req.send();
    });
  }

	/**
   * 图片转base64
   * @param {string} url 图片地址
   * @param {number} width canvas宽度，默认196
   * @param {number} height canvas宽度，默认196
   * @param {HTMLCanvasElement} inCanvas canvas元素，默认创建
   * @param {boolean} returnCanvas 是否返回canvas，默认false。默认返回base64的图片路径，有些时候需要接着画布添加元素，所以我们添加这个变量
	 * @return {object}  {url, status: 'ok', img} or {url, status: 'error'}  
   */
	async drawImage(url, width = 196, height = 196, inCanvas, returnCanvas) {
    const canvas = inCanvas && inCanvas instanceof HTMLCanvasElement ? inCanvas : document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imgData = await this.loadImagePromise(url)
		if(imgData.status == 'ok'){
			ctx.drawImage(imgData.img, 0, 0, canvas.width, canvas.height);
		}
    return returnCanvas? canvas : canvas.toDataURL('image/png'); //需要是否需要返回画布或者直接返回base64
  }


	/**
   * 获取图片数据
   * @param {string} url 图片地址
	 * @return {object}  {url, status: 'ok', img} or {url, status: 'error'}  
   */
	loadImagePromise(url){
		new Promise(resolve => {
			const img = new Image();
			img.onload = () => resolve({ url, status: 'ok', img });
			img.onerror = () => resolve({ url, status: 'error'});
			img.src = url;
		});
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
					if (!resp) {
						reject(new Error('No Resp'));
					}
					if (!resp.ok) {
						const errData = await resp.json();
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
    this.getQueryParams('debug') && console.log(`[${new Date().toLocaleString('zh-CN', {hour12: false})}]`, ...msg);
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

const Utils = new UlanziUtils()