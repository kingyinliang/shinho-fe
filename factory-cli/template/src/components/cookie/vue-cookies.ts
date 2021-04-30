import type { App } from 'vue'

interface DefaultConfig {
  expires?: string | number | Date;
  path?: string;
  domain?: string;
  secure?: string;
  sameSite?: string;
}

const defaultConfig: DefaultConfig = {
  expires: '1d',
  path: '; path=/',
  domain: '',
  secure: '',
  sameSite: '; SameSite=Lax'
}

export interface VueCookiesType {
  install(app: App): void

  config(expireTimes: string | number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: string): void;

  // eslint-disable-next-line
  set(keyName: string, value: any, expireTimes?: string | number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: string): this;

  // eslint-disable-next-line
  get(keyName: string): any;

  remove(keyName: string, path?: string, domain?: string): this | boolean;

  isKey(keyName: string): boolean;

  keys(): string[];
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $cookies: VueCookiesType // 这里可以用$Api具体的类型代替any
  }
}

const VueCookies: VueCookiesType = {
  install: function (app: App) {
    app.config.globalProperties.$cookies = this
  },
  config: function (expireTimes?: string | number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: string): void {
    defaultConfig.expires = expireTimes || '1d'
    defaultConfig.path = path ? '; path=' + path : '; path=/'
    defaultConfig.domain = domain ? '; domain=' + domain : ''
    defaultConfig.secure = secure ? '; Secure' : ''
    defaultConfig.sameSite = sameSite ? '; SameSite=' + sameSite : '; SameSite=Lax'
  },
  get: function (key: string) {
    let value = decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null

    if (value && value.substring(0, 1) === '{' && value.substring(value.length - 1, value.length) === '}') {
      try {
        value = JSON.parse(value)
      } catch (e) {
        return value
      }
    }
    return value
  },
  // eslint-disable-next-line
  set: function (key: string, value: any, expireTimes?: string | number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: string) {
    if (!key) {
      throw new Error('Cookie name is not find in first argument.')
    } else if (/^(?:expires|max-age|path|domain|secure|SameSite)$/i.test(key)) {
      throw new Error('Cookie key name illegality, Cannot be set to ["expires","max-age","path","domain","secure","SameSite"]\t current key name: ' + key)
    }
    // support json object
    if (value && value.constructor === Object) {
      value = JSON.stringify(value)
    }
    let _expires = ''
    expireTimes = expireTimes === undefined ? defaultConfig.expires : expireTimes
    if (expireTimes && expireTimes !== 0) {
      switch (expireTimes.constructor) {
        case Number:
          if (expireTimes === Infinity || expireTimes === -1) _expires = '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
          else _expires = '; max-age=' + expireTimes
          break
        case String:
          if (/^(?:\d+(y|m|d|h|min|s))$/i.test(expireTimes as string)) {
            // get capture number group
            const _expireTime = (expireTimes as string).replace(/^(\d+)(?:y|m|d|h|min|s)$/i, '$1')
            // get capture type group , to lower case
            switch ((expireTimes as string).replace(/^(?:\d+)(y|m|d|h|min|s)$/i, '$1').toLowerCase()) {
              // Frequency sorting
              case 'm':
                _expires = '; max-age=' + +_expireTime * 2592000
                break // 60 * 60 * 24 * 30
              case 'd':
                _expires = '; max-age=' + +_expireTime * 86400
                break // 60 * 60 * 24
              case 'h':
                _expires = '; max-age=' + +_expireTime * 3600
                break // 60 * 60
              case 'min':
                _expires = '; max-age=' + +_expireTime * 60
                break // 60
              case 's':
                _expires = '; max-age=' + _expireTime
                break
              case 'y':
                _expires = '; max-age=' + +_expireTime * 31104000
                break // 60 * 60 * 24 * 30 * 12
              default:
                Error('unknown exception of "set operation"')
            }
          } else {
            _expires = '; expires=' + expireTimes
          }
          break
        case Date:
          _expires = '; expires=' + (expireTimes as Date).toUTCString()
          break
      }
    }
    document.cookie =
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}${_expires}${domain ? '; domain=' + domain : defaultConfig.domain}${path ? '; path=' + path : defaultConfig.path}${secure === undefined ? defaultConfig.secure : secure ? '; Secure' : ''}${sameSite === undefined ? defaultConfig.sameSite : (sameSite ? '; SameSite=' + sameSite : '')}`
    return this
  },
  remove: function (key: string, path?: string, domain?: string) {
    if (!key || !this.isKey(key)) {
      return false
    }
    document.cookie = encodeURIComponent(key) +
      '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' +
      (domain ? '; domain=' + domain : defaultConfig.domain) +
      (path ? '; path=' + path : defaultConfig.path) +
      '; SameSite=Lax'
    return this
  },
  isKey: function (key: string) {
    return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)
  },
  keys: function (): string[] {
    if (!document.cookie) return []
    const _keys = document.cookie.replace(/((?:^|\s*;)[^=]+)(?=;|$)|^\s*|\s*(?:=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:=[^;]*)?;\s*/)
    for (let _index = 0; _index < _keys.length; _index++) {
      _keys[_index] = decodeURIComponent(_keys[_index])
    }
    return _keys
  }
}

// if (typeof exports == 'object') {
//   module.exports = VueCookies;
// } else if (typeof define == 'function' && define.amd) {
//   define([], function () {
//     return VueCookies;
//   });
// } else if (window.Vue) {
//   Vue.use(VueCookies);
// }
// if (typeof window !== 'undefined') {
//   window.$cookies = VueCookies;
// }

export default VueCookies
