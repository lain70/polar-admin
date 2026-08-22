<template>
  <admin-goods-layout eyebrow="ADMINISTRATOR MANAGEMENT" title="관리자 관리">
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="content-panel"><div class="panel-header"><div><p>ADMINISTRATOR LIST</p><h2>관리자 목록</h2></div><strong>총 {{ admins.length }}명</strong></div><div class="table-wrap"><table><thead><tr><th>관리자번호</th><th>아이디</th><th>이름</th><th>부서</th><th>직책</th><th>상태</th><th>사용 여부</th><th>등록일</th></tr></thead><tbody><tr v-for="admin in admins" :key="admin.adminNo"><td><router-link :to="{ name: 'adminAdminDetail', params: { adminNo: admin.adminNo } }">{{ admin.adminNo }}</router-link></td><td>{{ admin.adminId }}</td><td>{{ admin.adminName }}</td><td>{{ admin.adminDepartment || '-' }}</td><td>{{ admin.adminPosition || '-' }}</td><td>{{ admin.adminStatus }}</td><td>{{ admin.useYn }}</td><td>{{ formatDate(admin.regDate) }}</td></tr><tr v-if="!isLoading && !admins.length"><td colspan="8" class="empty">등록된 관리자가 없습니다.</td></tr></tbody></table></div></section>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminList } from '@/api/admin'

export default {
  name: 'AdminAdminListView',
  components: { AdminGoodsLayout },
  data: () => ({ admins: [], isLoading: false, errorMessage: '' }),
  created () {
    this.isLoading = true
    getAdminList().then(({ data }) => {
      this.admins = data
    }).catch(() => {
      this.errorMessage = '관리자 목록을 불러오지 못했습니다.'
    }).finally(() => {
      this.isLoading = false
    })
  },
  methods: {
    formatDate (value) {
      return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value)) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.content-panel { margin-top: 36px; padding: 28px; border: 1px solid #dce5e3; background: #fff; } .panel-header { display: flex; align-items: end; justify-content: space-between; margin-bottom: 22px; } .panel-header p { margin: 0 0 6px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; } .panel-header h2 { margin: 0; font-size: 21px; } .panel-header strong { color: #526c68; font-size: 12px; } .table-wrap { overflow-x: auto; } table { width: 100%; border-collapse: collapse; } th,td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; text-align: left; white-space: nowrap; } th { color: #718682; } td a { color: #163b43; font-weight: 700; text-decoration: none; } .empty { padding: 48px; color: #728682; text-align: center; } .error { margin-top: 24px; color: #b14949; } @media(max-width:650px){.content-panel{padding:18px}}
</style>
