/* eslint-env node */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const flush = () => new Promise(resolve => setImmediate(resolve))

for (const file of ['components/admin/AdminGoodsLayout.vue', 'views/admin/AdminDashboardView.vue']) {
  for (const fails of [false, true]) {
    test(`${file}: logout ${fails ? 'failure is reported and' : 'success'} returns to login`, async () => {
      const source = fs.readFileSync(path.join(__dirname, '../src', file), 'utf8').match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
        .replace(/^import[^\n]*\n/gm, '').replace('export default', 'module.exports =')
      const messages = []
      const context = { module: { exports: {} }, AdminSidebar: {}, alert: message => messages.push(message) }
      vm.runInNewContext(source, context)
      const component = context.module.exports
      const state = component.data()
      const routes = []
      state.$store = { dispatch: () => fails ? Promise.reject(new Error('logout failed')) : Promise.resolve() }
      state.$router = { replace: route => routes.push(route.name) }
      component.methods.logout.call(state)
      await flush()
      assert.deepEqual(routes, ['adminLogin'])
      assert.equal(messages.length, fails ? 1 : 0)
      if (fails) assert.match(messages[0], /로그아웃에 실패/)
    })
  }
}
