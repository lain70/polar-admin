<template>
  <div class="admin-layout">
    <admin-sidebar />
    <main>
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
      this.$store.dispatch('admin/logout').finally(() => {
        this.$router.replace({ name: 'adminLogin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-layout { min-height: 100vh; display: grid; grid-template-columns: 250px minmax(0, 1fr); background: #f2f6f5; color: #143139; text-align: left; }
main { min-width: 0; padding: 42px 48px 64px; }
header { display: flex; align-items: center; justify-content: space-between; }
header p { margin: 0 0 8px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; }
header h1 { margin: 0; font-family: Georgia, 'Noto Serif KR', serif; font-size: 34px; font-weight: 400; }
header button { padding: 9px 14px; border: 1px solid #c9d6d3; background: #fff; color: #526c68; cursor: pointer; }
@media (max-width: 800px) { .admin-layout { grid-template-columns: 1fr; } main { padding: 30px 20px; } }
</style>
