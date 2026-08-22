<template>
  <admin-goods-layout eyebrow="MEMBER MANAGEMENT" title="회원 관리">
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="content-panel">
      <div class="panel-header"><div><p>MEMBER LIST</p><h2>회원 목록</h2></div><strong>총 {{ users.length }}명</strong></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>회원번호</th><th>아이디</th><th>이름</th><th>연락처</th><th>등급</th><th>상태</th><th>가입일</th></tr></thead>
          <tbody>
            <tr v-for="user in users" :key="user.userNo"><td><router-link :to="{ name: 'adminUserDetail', params: { userNo: user.userNo } }">{{ user.userNo }}</router-link></td><td>{{ user.userId }}</td><td>{{ user.userName }}</td><td>{{ user.userPhone || '-' }}</td><td>{{ user.userGrade }}</td><td>{{ user.userStatus }}</td><td>{{ formatDate(user.regDate) }}</td></tr>
            <tr v-if="!isLoading && !users.length"><td colspan="7" class="empty">등록된 회원이 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminUserList } from '@/api/admin'

export default {
  name: 'AdminUserListView',
  components: { AdminGoodsLayout },
  data: () => ({ users: [], isLoading: false, errorMessage: '' }),
  created () {
    this.loadUsers()
  },
  methods: {
    loadUsers () {
      this.isLoading = true
      this.errorMessage = ''
      getAdminUserList().then(({ data }) => {
        this.users = data
      }).catch(() => {
        this.errorMessage = '회원 목록을 불러오지 못했습니다.'
      }).finally(() => {
        this.isLoading = false
      })
    },
    formatDate (value) {
      return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value)) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.content-panel { margin-top: 36px; padding: 28px; border: 1px solid #dce5e3; background: #fff; } .panel-header { display: flex; align-items: end; justify-content: space-between; margin-bottom: 22px; } .panel-header p { margin: 0 0 6px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; } .panel-header h2 { margin: 0; font-size: 21px; } .panel-header strong { color: #526c68; font-size: 12px; } .table-wrap { overflow-x: auto; } table { width: 100%; border-collapse: collapse; } th,td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; text-align: left; white-space: nowrap; } th { color: #718682; } td a { color: #163b43; font-weight: 700; text-decoration: none; } .empty { padding: 48px; color: #728682; text-align: center; } .error { margin-top: 24px; color: #b14949; } @media(max-width:650px){.content-panel{padding:18px}}
</style>
