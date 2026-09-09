<template>
  <aside class="admin-sidebar">
    <router-link class="brand" :to="{ name: 'adminDashboard' }"><span>P</span> POLAR ADMIN</router-link>
    <nav aria-label="관리자 메뉴">
      <router-link v-for="menu in menus" :key="menu.menuNo" exact :to="{ name: menu.routeName }">{{ menu.menuName }}</router-link>
    </nav>
    <p v-if="errorMessage" class="menu-error" role="alert">{{ errorMessage }}</p>
    <a :href="customerBaseUrl">상점으로 이동 ↗</a>
  </aside>
</template>

<script>
import envs from '@/envs'
import { getAdminMenus } from '@/api/admin'

export default {
  name: 'AdminSidebar',
  data: () => ({ menus: [], customerBaseUrl: envs.customerBaseUrl, errorMessage: '' }),
  created () {
    getAdminMenus()
      .then(({ data }) => { this.menus = data })
      .catch(() => { this.errorMessage = '관리자 메뉴를 불러오지 못했습니다.' })
  }
}
</script>

<style lang="scss" scoped>
.admin-sidebar { min-height: 100vh; padding: 34px 28px; box-sizing: border-box; display: flex; flex-direction: column; background: #102a31; color: #fff; }
.brand { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
.brand span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #77928e; border-radius: 50%; font-family: Georgia, serif; }
nav { margin-top: 72px; display: flex; flex-direction: column; gap: 8px; }
nav a { padding: 14px 16px; border-left: 2px solid transparent; color: #9eb1ae; font-size: 13px; text-decoration: none; }
nav a.active, nav a.router-link-active { border-color: #9fc5be; background: rgba(255,255,255,.06); color: #fff; }
.menu-error { margin: 20px 0 0; color: #f0a6a6; font-size: 11px; }
.admin-sidebar > a:last-child { margin-top: auto; color: #9fc5be; font-size: 11px; text-decoration: none; }
@media (max-width: 800px) { .admin-sidebar { min-height: auto; } nav { margin-top: 28px; flex-direction: row; overflow-x: auto; } .admin-sidebar > a:last-child { margin-top: 26px; } }
</style>
