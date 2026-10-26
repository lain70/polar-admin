<template>
  <div class="admin-layout">
    <a class="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <admin-sidebar />
    <main id="main-content" tabindex="-1">
      <header>
        <div><p>{{ eyebrow }}</p><h1>{{ title }}</h1></div>
        <button type="button" :disabled="isLoggingOut" @click="logout">로그아웃</button>
      </header>
      <slot />
    </main>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

export default {
  name: 'AdminGoodsLayout',
  components: { AdminSidebar },
  props: {
    title: { type: String, required: true },
    eyebrow: { type: String, default: 'ADMINISTRATION' }
  },
  data: () => ({ isLoggingOut: false }),
  methods: {
    logout () {
      this.isLoggingOut = true
      this.$store.dispatch('admin/logout').catch(() => {
        alert('서버 로그아웃에 실패했습니다. 이 기기의 로그인 정보는 삭제되었습니다.')
      }).finally(() => {
        this.$router.replace({ name: 'adminLogin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-layout { min-height: 100vh; display: grid; grid-template-columns: 240px minmax(0, 1fr); background: var(--color-background); color: var(--color-foreground); text-align: left; }
main { min-width: 0; padding: 42px 48px 64px; }
header { display: flex; align-items: center; justify-content: space-between; }
header p { margin: 0 0 8px; color: var(--color-muted-foreground); font-size: 12px; font-weight: 800; letter-spacing: .16em; }
header h1 { margin: 0; font-family: var(--font-body); font-size: 30px; font-weight: 700; }
header button { padding: 9px 14px; border: 1px solid #c9d6d3; background: #fff; color: #526c68; cursor: pointer; }
@media (max-width: 800px) { .admin-layout { grid-template-columns: minmax(0, 1fr); } main { padding: 30px 20px; } }
</style>
