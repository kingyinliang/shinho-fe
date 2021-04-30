import SSOLogin from '@/utils/SSOLogin'

interface LoginTs {
  init: () => void
}
export default function (): LoginTs {
  const init = () => {
    SSOLogin.getUserInfo().then(({ data }) => {
      sessionStorage.setItem('userInfo', JSON.stringify(data.data || {}))
    })
  }

  return {
    init
  }
}
