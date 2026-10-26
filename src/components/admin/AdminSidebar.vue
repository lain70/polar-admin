<template>
  <aside class="admin-sidebar">
    <router-link class="brand" :to="{ name: 'adminDashboard' }"><span>P</span> POLAR ADMIN</router-link>
    <nav aria-label="관리자 메뉴">
      <router-link v-for="menu in menus" :key="menu.menuNo" :to="{ name: menu.routeName }">{{ menu.menuName }}</router-link>
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
.admin-sidebar { min-width: 0; min-height: 100vh; padding: 32px 24px; box-sizing: border-box; display: flex; flex-direction: column; background: #102a31; color: #fff; }
.brand { display: flex; align-items: center; gap: 10px; color: #fff; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-decoration: none; }
.brand span { width: 32px; height: 32px; display: grid; place-items: center; border: 1px solid #77928e; border-radius: 50%; font-family: Georgia, serif; }
nav { margin-top: 72px; display: flex; flex-direction: column; gap: 8px; }
nav a { padding: 14px 16px; border-left: 2px solid transparent; color: #c0d3cd; font-size: 14px; text-decoration: none; }
nav a.router-link-exact-active { border-color: #9fc5be; background: rgba(255,255,255,.06); color: #fff; }
.menu-error { margin: 20px 0 0; color: #f0a6a6; font-size: 12px; }
.admin-sidebar > a:last-child { margin-top: auto; color: #9fc5be; font-size: 12px; text-decoration: none; }
@media (max-width: 800px) { .admin-sidebar { min-width: 0; min-height: auto; } nav { margin-top: 28px; flex-direction: row; overflow-x: auto; } .admin-sidebar > a:last-child { margin-top: 26px; } }

nav a { min-height: 48px; border-radius: 6px; white-space: nowrap; }
nav a:hover { background: rgba(255,255,255,.08); color: #fff; }
.admin-sidebar a:focus-visible { outline-color: #b9e1ce; }
.admin-sidebar > a:last-child { min-height: 44px; display: flex; align-items: center; }
@media (min-width: 801px) { .admin-sidebar { position: sticky; top: 0; height: 100vh; overflow-y: auto; } }
</style>
