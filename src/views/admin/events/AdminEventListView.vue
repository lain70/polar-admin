<template>
  <admin-goods-layout title="이벤트 관리">
    <admin-filter-panel>
      <form @submit.prevent="searchEvents">
        <div class="admin-filter-grid">
          <label class="admin-filter-field">검색 조건<select v-model="searchType"><option value="EVENT_NO">이벤트 번호</option></select></label>
          <label class="admin-filter-field">검색어<input v-model.trim="keyword" type="number" placeholder="이벤트 번호 입력"></label>
          <label class="admin-filter-field">진행 시작일<input v-model="eventStartDate" type="date"></label>
          <label class="admin-filter-field">진행 종료일<input v-model="eventEndDate" type="date"></label>
        </div>
        <div class="admin-filter-checks event-filter-checks">
          <details class="admin-filter-details">
            <summary>진행 상태 <span>{{ selectedStatuses.length ? `${selectedStatuses.length}개 선택` : '전체' }}</span></summary>
            <div class="admin-filter-check-list"><label v-for="option in statusOptions" :key="option.value"><input v-model="selectedStatuses" type="checkbox" :value="option.value">{{ option.label }}</label></div>
          </details>
          <details class="admin-filter-details">
            <summary>사용 여부 <span>{{ selectedUseYns.length ? `${selectedUseYns.length}개 선택` : '전체' }}</span></summary>
            <div class="admin-filter-check-list"><label v-for="option in ynOptions" :key="`use-${option.value}`"><input v-model="selectedUseYns" type="checkbox" :value="option.value">{{ option.label }}</label></div>
          </details>
          <details class="admin-filter-details">
            <summary>전시 여부 <span>{{ selectedDisplayYns.length ? `${selectedDisplayYns.length}개 선택` : '전체' }}</span></summary>
            <div class="admin-filter-check-list"><label v-for="option in ynOptions" :key="`display-${option.value}`"><input v-model="selectedDisplayYns" type="checkbox" :value="option.value">{{ option.label }}</label></div>
          </details>
        </div>
        <div class="admin-filter-actions"><button type="button" class="reset-button" @click="resetFilters">초기화</button><button type="submit">이벤트 조회</button></div>
      </form>
    </admin-filter-panel>
    <div class="result-header">
      <div><strong>전체 {{ events.length }}건</strong><span>등록된 이벤트를 조회하고 수정할 수 있습니다.</span></div>
      <router-link :to="{ name: 'adminEventCreate' }">이벤트 등록</router-link>
    </div>
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>번호</th><th>제목</th><th>진행기간</th><th>상태</th><th>사용</th><th>전시</th></tr></thead>
        <tbody>
          <tr v-for="event in events" :key="event.eventNo">
            <td>{{ event.eventNo }}</td>
            <td><router-link :to="{ name: 'adminEventEdit', params: { eventNo: event.eventNo } }">{{ event.eventTitle }}</router-link></td>
            <td>{{ date(event.eventStartDate) }} ~ {{ date(event.eventEndDate) }}</td>
            <td>{{ event.progressStatus === 'ENDED' ? '종료' : '진행중' }}</td>
            <td>{{ event.useYn }}</td><td>{{ event.displayYn }}</td>
          </tr>
          <tr v-if="!events.length"><td colspan="6" class="empty">등록된 이벤트가 없습니다.</td></tr>
        </tbody>
      </table>
    </div>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import AdminFilterPanel from '@/components/admin/AdminFilterPanel.vue'
import { getAdminEvents } from '@/api/admin'

export default {
  name: 'AdminEventListView',
  components: { AdminGoodsLayout, AdminFilterPanel },
  data: () => ({ events: [], searchType: 'EVENT_NO', keyword: '', eventStartDate: '', eventEndDate: '', selectedStatuses: [], selectedUseYns: [], selectedDisplayYns: [], errorMessage: '', statusOptions: [{ value: 'ONGOING', label: '진행중' }, { value: 'ENDED', label: '종료' }], ynOptions: [{ value: 'Y', label: '사용' }, { value: 'N', label: '미사용' }] }),
  created () {
    this.loadEvents()
  },
  methods: {
    loadEvents () {
      this.errorMessage = ''
      if (this.eventStartDate && this.eventEndDate && this.eventEndDate < this.eventStartDate) {
        this.errorMessage = '진행 종료일은 시작일 이후로 선택해 주세요.'
        return
      }
      getAdminEvents({ eventNo: this.keyword || undefined, eventStartDate: this.eventStartDate || undefined, eventEndDate: this.eventEndDate || undefined, statuses: this.selectedStatuses.length ? this.selectedStatuses.join(',') : undefined, useYns: this.selectedUseYns.length ? this.selectedUseYns.join(',') : undefined, displayYns: this.selectedDisplayYns.length ? this.selectedDisplayYns.join(',') : undefined })
        .then(({ data }) => { this.events = data })
        .catch(() => { this.errorMessage = '이벤트 목록을 불러오지 못했습니다.' })
    },
    searchEvents () { this.loadEvents() },
    resetFilters () { this.keyword = ''; this.eventStartDate = ''; this.eventEndDate = ''; this.selectedStatuses = []; this.selectedUseYns = []; this.selectedDisplayYns = []; this.loadEvents() },
    date (value) { return value ? value.slice(0, 16).replace('T', ' ') : '-' }
  }
}
</script>

<style lang="scss" scoped>
.result-header { margin: 36px 0 14px; display: flex; align-items: center; justify-content: space-between; } .result-header > div { display: flex; align-items: baseline; gap: 12px; } .result-header span { color: #728682; font-size: 11px; } .result-header a { padding: 12px 22px; background: #183c43; color: #fff; text-decoration: none; } .table-wrap { overflow-x: auto; background: #fff; } table { width: 100%; border-collapse: collapse; } th,td { padding: 15px; border-bottom: 1px solid #e1e8e6; font-size: 12px; text-align: left; } th { color: #718682; } td a { color: #163b43; text-decoration: none; } .empty { padding: 50px; text-align: center; } .error { color: #b14949; }
</style>
