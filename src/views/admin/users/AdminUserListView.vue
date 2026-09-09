<template>
  <admin-goods-layout title="회원 관리">
    <admin-filter-panel class="search-panel">
      <form @submit.prevent="searchUsers">
        <div class="primary-filters">
          <label>검색 조건<select v-model="searchType"><option value="USER_NO">회원번호</option><option value="USER_ID">아이디</option><option value="USER_NAME">이름</option><option value="USER_PHONE">연락처</option></select></label>
          <label class="keyword-field">검색어<input v-model.trim="keyword" :type="searchType === 'USER_NO' ? 'number' : 'text'" :placeholder="keywordPlaceholder"></label>
          <label>가입 시작일시<input v-model="registeredFrom" type="datetime-local"></label>
          <label>가입 종료일시<input v-model="registeredTo" type="datetime-local"></label>
        </div>
        <div class="advanced-filters">
          <details><summary>회원 등급 <span>{{ selectedGrades.length ? `${selectedGrades.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="grade in gradeOptions" :key="grade.value"><input v-model="selectedGrades" type="checkbox" :value="grade.value">{{ grade.label }}</label></div></details>
          <details><summary>회원 상태 <span>{{ selectedStatuses.length ? `${selectedStatuses.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="status in statusOptions" :key="status.value"><input v-model="selectedStatuses" type="checkbox" :value="status.value">{{ status.label }}</label></div></details>
        </div>
        <div class="search-actions"><button type="button" class="reset-button" @click="resetFilters">초기화</button><button type="submit">회원 조회</button></div>
      </form>
    </admin-filter-panel>
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="result-header"><div><strong>회원 조회 결과</strong><span>총 {{ users.length }}명</span></div></section>
    <div class="table-wrap"><table><thead><tr><th>회원번호</th><th>아이디</th><th>이름</th><th>연락처</th><th>등급</th><th>상태</th><th>가입일</th></tr></thead><tbody><tr v-for="user in users" :key="user.userNo"><td>{{ user.userNo }}</td><td><router-link class="account-link" :to="{ name: 'adminUserDetail', params: { userNo: user.userNo } }">{{ user.userId }}</router-link></td><td>{{ user.userName }}</td><td>{{ user.userPhone || '-' }}</td><td>{{ gradeLabel(user.userGrade) }}</td><td>{{ statusLabel(user.userStatus) }}</td><td>{{ formatDate(user.regDate) }}</td></tr><tr v-if="!isLoading && !users.length"><td colspan="7" class="empty">조회된 회원이 없습니다.</td></tr></tbody></table></div>
  </admin-goods-layout>
</template>
<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import AdminFilterPanel from '@/components/admin/AdminFilterPanel.vue'
import { getAdminUserList } from '@/api/admin'
export default {
  name: 'AdminUserListView',
  components: { AdminGoodsLayout, AdminFilterPanel },
  data: () => ({ users: [], searchType: 'USER_NAME', keyword: '', registeredFrom: '', registeredTo: '', selectedGrades: [], selectedStatuses: [], isLoading: false, errorMessage: '', gradeOptions: [{ value: 'BRONZE', label: '브론즈' }, { value: 'SILVER', label: '실버' }, { value: 'GOLD', label: '골드' }, { value: 'VIP', label: 'VIP' }], statusOptions: [{ value: 'USR_ST_001', label: '정상' }, { value: 'USR_ST_002', label: '정지' }] }),
  computed: { keywordPlaceholder () { return { USER_NO: '회원번호 입력', USER_ID: '아이디 입력', USER_NAME: '이름 입력', USER_PHONE: '연락처 입력' }[this.searchType] } },
  created () { this.loadUsers() },
  methods: {
    loadUsers () { this.errorMessage = ''; if (this.registeredFrom && this.registeredTo && this.registeredTo < this.registeredFrom) { this.errorMessage = '가입 종료일시는 시작일시 이후로 선택해 주세요.'; return } this.isLoading = true; getAdminUserList({ searchType: this.searchType, keyword: this.keyword || undefined, registeredFrom: this.registeredFrom || undefined, registeredTo: this.registeredTo || undefined, grades: this.selectedGrades.length ? this.selectedGrades.join(',') : undefined, statuses: this.selectedStatuses.length ? this.selectedStatuses.join(',') : undefined }).then(({ data }) => { this.users = data }).catch(error => { const body = error.response && error.response.data; this.errorMessage = (body && body.ERROR_MSG) || '회원 목록을 불러오지 못했습니다.' }).finally(() => { this.isLoading = false }) },
    searchUsers () { this.loadUsers() },
    resetFilters () { this.searchType = 'USER_NAME'; this.keyword = ''; this.registeredFrom = ''; this.registeredTo = ''; this.selectedGrades = []; this.selectedStatuses = []; this.loadUsers() },
    gradeLabel (value) { const option = this.gradeOptions.find(item => item.value === value); return option ? option.label : value },
    statusLabel (value) { const option = this.statusOptions.find(item => item.value === value); return option ? option.label : value },
    formatDate (value) { return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value)) : '-' }
  }
}
</script>
<style lang="scss" scoped>
.search-panel { margin-top: 36px; padding: 26px; border: 1px solid #d7e2df; background: #fff; } .primary-filters { display: grid; grid-template-columns: 160px minmax(220px,1fr) 220px 220px; gap: 16px; } label { display: flex; flex-direction: column; gap: 8px; color: #536a66; font-size: 11px; font-weight: 700; } input,select { min-width: 0; padding: 12px; box-sizing: border-box; border: 1px solid #cbd8d5; background: #fff; } .advanced-filters { margin-top: 18px; display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; } details { position: relative; border: 1px solid #d5dfdd; } summary { padding: 13px 14px; display: flex; justify-content: space-between; color: #405b57; font-size: 12px; font-weight: 700; cursor: pointer; list-style: none; } summary span { color: #82938f; font-size: 10px; font-weight: 400; } .checkbox-list { position: absolute; z-index: 3; top: 46px; left: -1px; right: -1px; max-height: 220px; padding: 14px; display: grid; gap: 11px; overflow-y: auto; border: 1px solid #cbd8d5; background: #fff; box-shadow: 0 12px 28px rgba(20,49,57,.12); } .checkbox-list label { flex-direction: row; align-items: center; } .checkbox-list input { padding: 0; } .search-actions { margin-top: 22px; display: flex; justify-content: center; gap: 8px; } button { padding: 12px 22px; border: 0; background: #183c43; color: #fff; cursor: pointer; } .reset-button { border: 1px solid #b9cac6; background: #fff; color: #526c68; } .result-header { margin: 28px 0 12px; display: flex; align-items: center; justify-content: space-between; } .result-header > div { display: flex; align-items: baseline; gap: 10px; } .result-header span { color: #728682; font-size: 11px; } .table-wrap { overflow-x: auto; background: #fff; } table { width: 100%; border-collapse: collapse; } th,td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; } th { color: #718682; text-align: left; } td a { color: #2563eb; font-weight: 700; text-decoration: none; } .empty { padding: 50px; text-align: center; } .error { color: #b14949; } @media(max-width:1100px){.primary-filters{grid-template-columns:1fr 2fr}.advanced-filters{grid-template-columns:1fr}} @media(max-width:650px){.primary-filters{grid-template-columns:1fr}}
</style>
