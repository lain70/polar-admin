<template>
  <admin-goods-layout title="이벤트 관리">
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
import { getAdminEvents } from '@/api/admin'

export default {
  name: 'AdminEventListView',
  components: { AdminGoodsLayout },
  data: () => ({ events: [], errorMessage: '' }),
  created () {
    getAdminEvents()
      .then(({ data }) => { this.events = data })
      .catch(() => { this.errorMessage = '이벤트 목록을 불러오지 못했습니다.' })
  },
  methods: { date (value) { return value ? value.slice(0, 16).replace('T', ' ') : '-' } }
}
</script>

<style lang="scss" scoped>
.result-header { margin: 36px 0 14px; display: flex; align-items: center; justify-content: space-between; } .result-header > div { display: flex; align-items: baseline; gap: 12px; } .result-header span { color: #728682; font-size: 11px; } .result-header a { padding: 12px 22px; background: #183c43; color: #fff; text-decoration: none; } .table-wrap { overflow-x: auto; background: #fff; } table { width: 100%; border-collapse: collapse; } th,td { padding: 15px; border-bottom: 1px solid #e1e8e6; font-size: 12px; text-align: left; } th { color: #718682; } td a { color: #163b43; text-decoration: none; } .empty { padding: 50px; text-align: center; } .error { color: #b14949; }
</style>
