<template>
  <admin-goods-layout title="관리자 관리">
    <section class="search-panel">
      <form @submit.prevent="searchAdmins">
        <div class="primary-filters">
          <label>검색 조건<select v-model="searchType"><option value="ADMIN_NO">관리자번호</option><option value="ADMIN_ID">아이디</option><option value="ADMIN_NAME">이름</option></select></label>
          <label class="keyword-field">검색어<input v-model.trim="keyword" :type="searchType === 'ADMIN_NO' ? 'number' : 'text'" :placeholder="keywordPlaceholder"></label>
          <label>가입 시작일시<input v-model="registeredFrom" type="datetime-local"></label>
          <label>가입 종료일시<input v-model="registeredTo" type="datetime-local"></label>
        </div>
        <div class="advanced-filters">
          <details><summary>부서 <span>{{ selectedDepartments.length ? `${selectedDepartments.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="department in departmentOptions" :key="department"><input v-model="selectedDepartments" type="checkbox" :value="department">{{ department }}</label><p v-if="!departmentOptions.length">등록된 부서가 없습니다.</p></div></details>
          <details><summary>직책 <span>{{ selectedPositions.length ? `${selectedPositions.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="position in positionOptions" :key="position"><input v-model="selectedPositions" type="checkbox" :value="position">{{ position }}</label><p v-if="!positionOptions.length">등록된 직책이 없습니다.</p></div></details>
          <details><summary>관리자 상태 <span>{{ selectedStatuses.length ? `${selectedStatuses.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="status in statusOptions" :key="status.value"><input v-model="selectedStatuses" type="checkbox" :value="status.value">{{ status.label }}</label></div></details>
          <details><summary>사용 여부 <span>{{ selectedUseYns.length ? `${selectedUseYns.length}개 선택` : '전체' }}</span></summary><div class="checkbox-list"><label v-for="option in useYnOptions" :key="option.value"><input v-model="selectedUseYns" type="checkbox" :value="option.value">{{ option.label }}</label></div></details>
        </div>
        <div class="search-actions"><button type="button" class="reset-button" @click="resetFilters">초기화</button><button type="submit">관리자 조회</button></div>
      </form>
    </section>
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="result-header"><div><strong>관리자 조회 결과</strong><span>총 {{ admins.length }}명</span></div></section>
    <div class="table-wrap"><table><thead><tr><th>관리자번호</th><th>아이디</th><th>이름</th><th>연락처</th><th>부서</th><th>직책</th><th>상태</th><th>사용 여부</th><th>가입일</th></tr></thead><tbody><tr v-for="admin in admins" :key="admin.adminNo"><td>{{ admin.adminNo }}</td><td><router-link class="account-link" :to="{ name: 'adminAdminDetail', params: { adminNo: admin.adminNo } }">{{ admin.adminId }}</router-link></td><td>{{ admin.adminName }}</td><td>{{ admin.adminPhone || '-' }}</td><td>{{ admin.adminDepartment || '-' }}</td><td>{{ admin.adminPosition || '-' }}</td><td>{{ statusLabel(admin.adminStatus) }}</td><td>{{ admin.useYn === 'Y' ? '사용' : '미사용' }}</td><td>{{ formatDate(admin.regDate) }}</td></tr><tr v-if="!isLoading && !admins.length"><td colspan="9" class="empty">조회된 관리자가 없습니다.</td></tr></tbody></table></div>
  </admin-goods-layout>
</template>
<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminList } from '@/api/admin'
export default {
  name: 'AdminAdminListView',
  components: { AdminGoodsLayout },
  data: () => ({ admins: [], searchType: 'ADMIN_NAME', keyword: '', registeredFrom: '', registeredTo: '', selectedDepartments: [], selectedPositions: [], selectedStatuses: [], selectedUseYns: [], departmentOptions: [], positionOptions: [], statusOptions: [{ value: 'AD_ST_001', label: '정상' }, { value: 'AD_ST_002', label: '정지' }], useYnOptions: [{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }], isLoading: false, errorMessage: '' }),
  computed: { keywordPlaceholder () { return { ADMIN_NO: '관리자번호 입력', ADMIN_ID: '아이디 입력', ADMIN_NAME: '이름 입력' }[this.searchType] } },
  created () { this.loadAdmins() },
  methods: {
    loadAdmins () { this.errorMessage = ''; if (this.registeredFrom && this.registeredTo && this.registeredTo < this.registeredFrom) { this.errorMessage = '가입 종료일시는 시작일시 이후로 선택해 주세요.'; return } this.isLoading = true; getAdminList({ searchType: this.searchType, keyword: this.keyword || undefined, registeredFrom: this.registeredFrom || undefined, registeredTo: this.registeredTo || undefined, departments: this.selectedDepartments.length ? this.selectedDepartments.join(',') : undefined, positions: this.selectedPositions.length ? this.selectedPositions.join(',') : undefined, statuses: this.selectedStatuses.length ? this.selectedStatuses.join(',') : undefined, useYns: this.selectedUseYns.length ? this.selectedUseYns.join(',') : undefined }).then(({ data }) => { this.admins = data; if (!this.departmentOptions.length) this.departmentOptions = [...new Set(data.map(item => item.adminDepartment).filter(Boolean))]; if (!this.positionOptions.length) this.positionOptions = [...new Set(data.map(item => item.adminPosition).filter(Boolean))] }).catch(error => { const body = error.response && error.response.data; this.errorMessage = (body && body.ERROR_MSG) || '관리자 목록을 불러오지 못했습니다.' }).finally(() => { this.isLoading = false }) },
    searchAdmins () { this.loadAdmins() },
    resetFilters () { this.searchType = 'ADMIN_NAME'; this.keyword = ''; this.registeredFrom = ''; this.registeredTo = ''; this.selectedDepartments = []; this.selectedPositions = []; this.selectedStatuses = []; this.selectedUseYns = []; this.loadAdmins() },
    statusLabel (value) { const option = this.statusOptions.find(item => item.value === value); return option ? option.label : value },
    formatDate (value) { return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(value)) : '-' }
  }
}
</script>
<style lang="scss" scoped>
.search-panel { margin-top: 36px; padding: 26px; border: 1px solid #d7e2df; background: #fff; } .primary-filters { display: grid; grid-template-columns: 160px minmax(220px,1fr) 220px 220px; gap: 16px; } label { display: flex; flex-direction: column; gap: 8px; color: #536a66; font-size: 11px; font-weight: 700; } input,select { min-width: 0; padding: 12px; box-sizing: border-box; border: 1px solid #cbd8d5; background: #fff; } .advanced-filters { margin-top: 18px; display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; } details { position: relative; border: 1px solid #d5dfdd; } summary { padding: 13px 14px; display: flex; justify-content: space-between; color: #405b57; font-size: 12px; font-weight: 700; cursor: pointer; list-style: none; } summary span { color: #82938f; font-size: 10px; font-weight: 400; } .checkbox-list { position: absolute; z-index: 3; top: 46px; left: -1px; right: -1px; max-height: 220px; padding: 14px; display: grid; gap: 11px; overflow-y: auto; border: 1px solid #cbd8d5; background: #fff; box-shadow: 0 12px 28px rgba(20,49,57,.12); } .checkbox-list label { flex-direction: row; align-items: center; } .checkbox-list input { padding: 0; } .checkbox-list p { color: #879793; font-size: 11px; } .search-actions { margin-top: 22px; display: flex; justify-content: center; gap: 8px; } button { padding: 12px 22px; border: 0; background: #183c43; color: #fff; cursor: pointer; } .reset-button { border: 1px solid #b9cac6; background: #fff; color: #526c68; } .result-header { margin: 28px 0 12px; display: flex; align-items: center; justify-content: space-between; } .result-header > div { display: flex; align-items: baseline; gap: 10px; } .result-header span { color: #728682; font-size: 11px; } .table-wrap { overflow-x: auto; background: #fff; } table { width: 100%; border-collapse: collapse; } th,td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; } th { color: #718682; text-align: left; } td a { color: #2563eb; font-weight: 700; text-decoration: none; } .empty { padding: 50px; text-align: center; } .error { color: #b14949; } @media(max-width:1100px){.primary-filters{grid-template-columns:1fr 2fr}.advanced-filters{grid-template-columns:1fr 1fr}} @media(max-width:650px){.primary-filters,.advanced-filters{grid-template-columns:1fr}}
</style>
