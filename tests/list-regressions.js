/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')

function loadComponent (file, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../src/views', file), 'utf8')
  const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
    .replace(/^import[\s\S]*?from[^\n]*\n/gm, '')
    .replace('export default', 'module.exports =')
  const context = { AdminGoodsLayout: {}, AdminFilterPanel: {}, module: { exports: {} }, console: { log () {} }, ...dependencies }
  vm.runInNewContext(script, context, { filename: file })
  const component = context.module.exports
  const state = component.data()
  for (const [name, method] of Object.entries(component.methods || {})) state[name] = method.bind(state)
  for (const [name, getter] of Object.entries(component.computed || {})) Object.defineProperty(state, name, { get: getter.bind(state) })
  return { state, source }
}

function deferred () {
  const request = {}
  request.promise = new Promise((resolve, reject) => { request.resolve = resolve; request.reject = reject })
  return request
}

const flush = () => new Promise(resolve => setImmediate(resolve))

const cases = [
  ['admin/goods/AdminGoodsListView.vue', 'getAdminGoodsList', 'loadGoods', 'goods', true],
  ['admin/qna/AdminQnaListView.vue', 'getAdminQnaList', 'loadQna', 'qnaList', true],
  ['admin/users/AdminUserListView.vue', 'getAdminUserList', 'loadUsers', 'users', false],
  ['admin/admins/AdminAdminListView.vue', 'getAdminList', 'loadAdmins', 'admins', false],
  ['admin/events/AdminEventListView.vue', 'getAdminEvents', 'loadEvents', 'events', false]
]
const payload = (items, paged) => ({ data: paged ? { items, totalCount: items.length, brands: [], categories: [] } : items })
for (const [file, api, method, field, paged] of cases) {
  function setup () {
    const requests = []
    const { state } = loadComponent(file, { [api]: () => { const request = deferred(); requests.push(request); return request.promise } })
    return { state, requests }
  }
  test(`${field}: late success cannot overwrite newer results`, async () => {
    const { state, requests } = setup()
    state[method](); state[method]()
    requests[1].resolve(payload([{ id: 'new' }], paged)); await flush()
    requests[0].resolve(payload([{ id: 'old' }], paged)); await flush()
    assert.equal(state[field][0].id, 'new')
    assert.equal(state.errorMessage, '')
  })
  test(`${field}: stale failure cannot set an error or finish the active loading state`, async () => {
    const { state, requests } = setup()
    state[method](); state[method]()
    requests[0].reject(new Error('old request failed')); await flush()
    assert.equal(state.errorMessage, '')
    if ('isLoading' in state) assert.equal(state.isLoading, true)
    requests[1].resolve(payload([{ id: 'new' }], paged)); await flush()
    assert.equal(state[field][0].id, 'new')
    if ('isLoading' in state) assert.equal(state.isLoading, false)
  })
  test(`${field}: current failure is still visible`, async () => {
    const { state, requests } = setup()
    state[method](); state[method]()
    requests[1].reject(new Error('current request failed')); await flush()
    const message = state.errorMessage
    assert.ok(message)
    requests[0].resolve(payload([{ id: 'old' }], paged)); await flush()
    assert.equal(state.errorMessage, message)
    assert.equal(state[field].length, 0)
  })
  test(`${field}: invalid date filters supersede the pending query`, async () => {
    const { state, requests } = setup()
    state[method]()
    if (field === 'events') { state.eventStartDate = '2026-10-25'; state.eventEndDate = '2026-10-24' } else { state.registeredFrom = '2026-10-25'; state.registeredTo = '2026-10-24' }
    state[method]()
    const message = state.errorMessage
    assert.ok(message)
    assert.equal(requests.length, 1)
    requests[0].resolve(payload([{ id: 'old' }], paged)); await flush()
    assert.equal(state.errorMessage, message)
    assert.equal(state[field].length, 0)
    if ('isLoading' in state) assert.equal(state.isLoading, false)
  })
}
for (const file of ['admin/goods/AdminGoodsListView.vue', 'admin/goods/AdminGoodsDetailView.vue']) {
  test(`${file}: zero discount remains zero in the rendered price expression`, () => {
    const source = fs.readFileSync(path.join(__dirname, '../src/views', file), 'utf8')
    const expression = source.match(/currency\((goods\.discountPrice[^)]*)\)/)[1]
    for (const [discountPrice, expected] of [[0, 0], [null, 10000], [undefined, 10000], [5000, 5000]]) {
      assert.equal(vm.runInNewContext(expression, { goods: { discountPrice, salePrice: 10000 } }), expected)
    }
  })
}
