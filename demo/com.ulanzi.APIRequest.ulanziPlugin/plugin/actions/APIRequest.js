import axios from 'axios';

import fs from 'fs';
import { createSVGWindow } from 'svgdom'
import { SVG, registerWindow } from '@svgdotjs/svg.js';

import { Utils } from './ulanzi-api/index.js';
import { COLORS } from './colors.js';

const window = createSVGWindow()
const document = window.document

// register window and document
registerWindow(window, document)



export default function APIRequest(context, $UD) {
  var settings = {},
    context = context,
    poll_timer = 0,
    allowSend = true,
    lastIcon = '',
    $UD = $UD,
    key_state = null;
    const IS_GETRES = context.indexOf('getResult')>=0

  function startPeriodicPoll() {

    if (poll_timer !== 0) {
      clearInterval(poll_timer);
      poll_timer = 0;
    }

    const frequency = settings.poll_status_frequency || 15;

    poll_timer = setInterval(function () {
      sendRequest(true);
    }, 1000 * frequency);
  }

  function sendRequest(do_status_poll = false) {

    // console.log('===settings:', do_status_poll, settings)

    let current_setting_poll = Boolean(settings.response_parse) && Boolean(settings.poll_status) && settings.poll_status_url


    if (!do_status_poll && settings.request_url) {
      current_setting_poll = false
    }

    if (!do_status_poll) {
      notifyCanvasIcon('default')
      key_state = null
    }

    if (do_status_poll) {
      if (!current_setting_poll) {
        destroy()
        return
      };
    }



    let url = current_setting_poll ? settings.poll_status_url : settings.request_url;
    let method = (current_setting_poll ? settings.poll_status_method : settings.request_method) || 'GET';

    if (!url) {
      // notifyCanvasIcon('error')
      return;
    }
    try {
      const opts = {
        // timeout: 1000,
        cache: 'no-cache',
        headers: constructHeaders(),
        method: method,
        url,
        data: ['GET', 'HEAD'].includes(method)
          ? undefined
          : (settings.request_body ? JSON.parse(settings.request_body) : {}),
      };

      log('sendRequest(): URL:', url, 'ARGS:', opts);

      axios(url, opts)
        .then((resp) => checkResponseStatus(resp))
        .then((resp) => showSuccess(resp, current_setting_poll))
        .then((resp) => {
          if (IS_GETRES) {
            updateTxt(resp, current_setting_poll)
          } else {
            updateImage(resp, current_setting_poll)
          }
        })
        .catch(e => {
          notifyCanvasIcon('error', { name: e.name, message: e.message })
          console.log('==fetch error:', e);
        }
        );
    } catch (e) {
      notifyCanvasIcon('error', { name: e.name, message: e.message })
    }


    if (!do_status_poll)
      startPeriodicPoll();
  }

  function constructHeaders() {
    let default_headers = settings.request_content_type
      ? { 'Content-Type': settings.request_content_type }
      : {};
    let input_headers = {};

    if (settings.request_headers) {
      settings.request_headers.split(/\n/).forEach(h => {
        if (h.includes(':')) {
          const [name, value] = h.split(/: *(.*)/).map(s => {
            return s.trim();
          });

          if (name) {
            input_headers[name] = value;
          }
        }
      });
    }

    return {
      ...default_headers,
      ...input_headers
    }
  }

  async function checkResponseStatus(resp) {
    if (!resp) {
      throw new Error('NULL');
    }
    if (!resp.data) {
      throw new Error(`E${resp.status}`);
    }
    return resp;
  }

  async function updateTxt(resp, do_status_poll) {
    const prefix = (do_status_poll && settings.poll_status && settings.poll_status_parse) ? 'poll_status' : 'response';
    const field = settings[`${prefix}_parse_field`]
    if (field) {
      const colorIndex = settings[`${prefix}_color`] || 0
      const { stroke,background } = COLORS[colorIndex].cls;

      const canvasSize = 200
      const centerX = canvasSize / 2;
      let fontSize = 40;
      let weight = 'bold';
      //创建画布
      const draw = SVG(document.documentElement).size(canvasSize, canvasSize);
      draw.rect(canvasSize, canvasSize).fill(background);

      let lines = []
      let lineHeight = fontSize * 1.4;
      let textHeight = lines.length * lineHeight;
      let startY = (canvasSize - textHeight) / 2 + lineHeight/2;
      const data = resp.data
      if (field === '*') {
        lines = splitIntoLines(JSON.stringify(data))
        fontSize = 26;
        weight = 'normal'
        lineHeight = fontSize * 1.4;
        startY = lineHeight/2;

      } else {
        if(field.indexOf("}}")>=0){
          lines = parseByTemplate(data, field)
        }else{
          let value = Utils.getProperty(data, field)
          if (typeof value === 'object') {
            value = JSON.stringify(value).replace(/"/g, '');
          }
          lines = [ value ]
        }
        lineHeight = fontSize * 1.4;
        textHeight = lines.length * lineHeight;
        startY = (canvasSize - textHeight) / 2 + lineHeight/2;

      }

      lines.forEach((item, index) => {
        draw.text(item).font({
          size: fontSize,
          weight: weight,
          fill: stroke,
          anchor: 'middle'
        }).center(centerX, startY + lineHeight * index);
      })

      // 生成 SVG 内容
      const svgContent = draw.svg();


      // 将 SVG 内容转换为 base64
      const base64Svg = Buffer.from(svgContent).toString('base64');
      const s_url = 'data:image/svg+xml;base64,' + base64Svg;

      setIcon(s_url);

      // 清空画布
      draw.clear();


    }

  }


  function parseByTemplate(data, template) {
    // 通过路径安全取值

    return template
      .split('\\n')
      .map(line => {
        return line.replace(/{{\s*([^}]+)\s*}}/g, (_, path) => {
          const value = Utils.getProperty(data, path.trim());

          if (value === undefined || value === null) return '';

          if (typeof value === 'object') {
            return JSON.stringify(value).replace(/"/g, '');
          }

          return value;
        });
      });
  }

  async function updateImage(resp, do_status_poll) {
    // console.log('===updateImage:', do_status_poll,settings)
    if (!settings.response_parse || !settings.image_matched || !settings.image_unmatched) {

      // await notifyCanvasIcon('success')

      return;
    }

    let json, body;
    let new_key_state = key_state;

    const prefix = (do_status_poll && settings.poll_status && settings.poll_status_parse) ? 'poll_status' : 'response';
    const field = Utils.getProp(settings, `${prefix}_parse_field`, undefined);
    const value = Utils.getProp(settings, `${prefix}_parse_value`, undefined);

    if (field !== undefined && value !== undefined) {
      json = resp.data;

      let resValue = Utils.getProperty(json, field);
      resValue = typeof resValue == 'boolean' ? resValue.toString() : resValue;
      new_key_state = (resValue == value);

      // log('====tils.getProperty(json, field) == value',resValue , value)
    } else if (field !== undefined) {
      json = resp.data;
      new_key_state = !(['false', '0', '', 'undefined'].indexOf(String(Utils.getProperty(json, field)).toLowerCase().trim()) + 1);
    } else if (value !== undefined) {
      body = resp.data;
      new_key_state = body.includes(value);
    }

    // console.log('===new_key_state:', new_key_state,key_state)
    if (new_key_state == key_state) return;

    key_state = new_key_state;

    const path = key_state
      ? settings.image_matched
      : settings.image_unmatched;

    // log('updateImage(): FILE:', path, 'JSON:', json, 'BODY:', body);
    log('---send custom  icon')

    setIcon(path)
    // Utils.loadImage(path, img => setIcon(context, img));

    return resp;
  }

  function setIcon(icon) {
    if (!allowSend) return
    lastIcon = icon || lastIcon
    if(lastIcon.indexOf(';base64,')>=0){
      $UD.setBaseDataIcon(context, lastIcon)
    }else{
      $UD.setPathIcon(context, lastIcon)
    }
  }

  async function showSuccess(resp, do_status_poll) {
    if (!do_status_poll && Boolean(settings.enable_success_indicator)) {
      await notifyCanvasIcon('success')
    }
    return resp;
  }



  async function notifyCanvasIcon(type, msg) {
    const NOTIFY_ICON = {
      'default': {
        background: 'transparent',
        src: `/assets/icons/${IS_GETRES?'text':'match'}.svg`
      },
      'success': {
        background: '#3FD88A',
        src: '/assets/actions/success.png'
      },
      'error': {
        background: '#FF1000',
        src: '/assets/actions/fail.png'
      }
    }
    const src = type ? NOTIFY_ICON[type].src : NOTIFY_ICON['default'].src


    // if (background == "transparent") {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    // } else {
    //   ctx.fillStyle = background;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    // console.log('=load imgae logo:', type, msg)

    const canvas_size = 200
    const centerX = canvas_size / 2;
    //创建画布
    const draw = SVG(document.documentElement).size(canvas_size, canvas_size);



    const imgData = await getImageBase64(src)
    draw.image(imgData).size(canvas_size, canvas_size).attr({ preserveAspectRatio: 'none' });

    if (msg) {
      draw.text(msg.name).font({
        size: `34px`,
        weight: 'bold',
        fill: "#000",
        anchor: 'middle'
      }).move(centerX, centerX - 38);

      if (msg.message) {
        const lines = splitIntoLines(msg.message)
        lines.forEach((item, index) => {

          draw.text(item).font({
            size: `26px`,
            fill: "#000",
            anchor: 'middle'
          }).move(centerX, centerX);
        })

      }
    }


    // 生成 SVG 内容
    const svgContent = draw.svg();


    // 将 SVG 内容转换为 base64
    const base64Svg = Buffer.from(svgContent).toString('base64');
    const s_url = 'data:image/svg+xml;base64,' + base64Svg;

    setIcon(s_url);

    // 清空画布
    draw.clear();


    // console.log('=send default success icon',background)



  }
  function splitIntoLines(str, chunkSize = 14) {
    let result = [];

    for (let i = 0; i < str.length; i += chunkSize) {
      // 截取字符串的一部分并添加到结果数组中
      result.push(str.substr(i, chunkSize));
    }

    return result;
  }

  function getImageBase64(url) {
    const imgData = fs.readFileSync(Utils.getPluginPath() + url);
    const icon = 'data:image/jpeg;base64,' + imgData.toString('base64');

    return icon
  }

  function updateSettings(new_settings, type) {
    // console.log('-------------===updateSettings:', new_settings, type)
    settings = new_settings;
    key_state = null

    if (type == 'init' && Boolean(settings.response_parse) && Boolean(settings.poll_status) && settings.poll_status_url) {
      sendRequest(true);
      startPeriodicPoll()
    }

  }

  function setActive(active) {
    allowSend = true;
    setIcon()
    allowSend = active;
  }

  function destroy() {
    if (poll_timer !== 0) {
      clearInterval(poll_timer);
      poll_timer = 0;
    }
  }

  // startPeriodicPoll();
  // sendRequest(do_status_poll = true);
  notifyCanvasIcon('default')

  return {
    sendRequest: sendRequest,
    updateSettings: updateSettings,
    destroy: destroy,
    setActive: setActive
  };
}

function log(...msg) {
  console.log(`[${new Date().toLocaleString()}] `, ...msg);
}

function stringify(input) {
  if (typeof input !== 'object' || input instanceof Error) {
    return input.toString();
  }
  return JSON.stringify(input, null, 2);
}
