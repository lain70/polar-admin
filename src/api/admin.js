import requestAdmin from '@/utils/requestAdmin'

export function loginAdmin (params) {
  return requestAdmin({
    url: '/admin/auth/login',
    method: 'POST',
    data: params
  })
}

export function logoutAdmin () {
  return requestAdmin({
    url: '/admin/auth/logout',
    method: 'POST'
  })
}

export function getAdminGoodsList (params) {
  return requestAdmin({ url: '/admin/goods', method: 'GET', params })
}

export function getAdminGoods (goodsNo) {
  return requestAdmin({ url: `/admin/goods/${goodsNo}`, method: 'GET' })
}

export function createAdminGoods (formData) {
  return requestAdmin({
    url: '/admin/goods',
    method: 'POST',
    data: formData
  })
}

export function getAdminUserList () {
  return requestAdmin({ url: '/admin/users', method: 'GET' })
}

export function getAdminUser (userNo) {
  return requestAdmin({ url: `/admin/users/${userNo}`, method: 'GET' })
}

export function getAdminList () {
  return requestAdmin({ url: '/admin/admins', method: 'GET' })
}

export function getAdmin (adminNo) {
  return requestAdmin({ url: `/admin/admins/${adminNo}`, method: 'GET' })
}
