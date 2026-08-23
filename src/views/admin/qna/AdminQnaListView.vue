<template>
  <admin-goods-layout title="문의 관리">
    <section class="search-panel">
      <form @submit.prevent="searchQna">
        <div class="primary-filters">
          <label>검색 조건<select v-model="searchType"><option value="QNA_NO">문의번호</option><option value="QNA_TITLE">제목</option></select></label>
          <label class="keyword-field">검색어<input v-model.trim="keyword" :type="searchType === 'QNA_NO' ? 'number' : 'text'" :placeholder="keywordPlaceholder"></label>
          <label>등록 시작일시<input v-model="registeredFrom" type="datetime-local"></label>
          <label>등록 종료일시<input v-model="registeredTo" type="datetime-local"></label>
        </div>
        <div class="advanced-filters">
          <details>
            <summary>답변 여부 <span>{{ selectedAnswerYns.length ? `${selectedAnswerYns.length}개 선택` : '전체' }}</span></summary>
            <div class="checkbox-list">
              <label v-for="answer in answerOptions" :key="answer.value"><input v-model="selectedAnswerYns" type="checkbox" :value="answer.value">{{ answer.label }}</label>
            </div>
          </details>
        </div>
        <div class="search-actions"><button type="button" class="reset-button" @click="resetFilters">초기화</button><button type="submit">문의 조회</button></div>
      </form>
    </section>

    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section class="result-header"><div><strong>문의 조회 결과</strong><span>총 {{ totalCount }}건</span></div><label>목록 표시<select v-model.number="pageSize" @change="changePageSize"><option :value="20">20개</option><option :value="50">50개</option><option :value="100">100개</option></select></label></section>
    <div class="table-wrap">
      <table>
        <thead><tr><th>문의번호</th><th>제목</th><th>작성자</th><th>등록일시</th><th>답변여부</th></tr></thead>
        <tbody>
          <tr v-for="qna in qnaList" :key="qna.qnaNo">
            <td>{{ qna.qnaNo }}</td>
            <td><router-link :to="{ name: 'adminQnaDetail', params: { qnaNo: qna.qnaNo } }">{{ qna.qnaTitle }}</router-link></td>
            <td>{{ qna.qnaUserId || '-' }}</td>
            <td>{{ formatDateTime(qna.regDate) }}</td>
            <td><span class="answer-status" :class="{ complete: qna.answerYn === 'Y' }">{{ qna.answerYn === 'Y' ? '답변 완료' : '답변 대기' }}</span></td>
          </tr>
          <tr v-if="!isLoading && !qnaList.length"><td colspan="5" class="empty">조회된 문의가 없습니다.</td></tr>
        </tbody>
      </table>
    </div>
    <nav v-if="totalPages > 1" class="pagination" aria-label="문의 목록 페이지">
      <button type="button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
      <button v-for="pageNumber in visiblePageNumbers" :key="pageNumber" type="button" :class="{ active: currentPage === pageNumber }" @click="changePage(pageNumber)">{{ pageNumber }}</button>
      <button type="button" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">다음</button>
    </nav>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminQnaList } from '@/api/admin'

export default {
  name: 'AdminQnaListView',
  components: { AdminGoodsLayout },
  data: () => ({
    qnaList: [],
    searchType: 'QNA_TITLE',
    keyword: '',
    registeredFrom: '',
    registeredTo: '',
    selectedAnswerYns: [],
    answerOptions: [{ value: 'N', label: '답변 대기' }, { value: 'Y', label: '답변 완료' }],
    totalCount: 0,
    currentPage: 1,
    pageSize: 20,
    isLoading: false,
    errorMessage: ''
  }),
  computed: {
    keywordPlaceholder () {
      return this.searchType === 'QNA_NO' ? '문의번호 입력' : '문의 제목 입력'
    },
    totalPages () {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize))
    },
    visiblePageNumbers () {
      const pageCount = Math.min(this.totalPages, 5)
      const startPage = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - pageCount + 1))
      return Array.from({ length: pageCount }, (_, index) => startPage + index)
    }
  },
  created () {
    this.loadQna()
  },
  methods: {
    loadQna () {
      this.errorMessage = ''
      if (this.registeredFrom && this.registeredTo && this.registeredTo < this.registeredFrom) {
        this.errorMessage = '등록 종료일시는 시작일시 이후로 선택해 주세요.'
        return
      }
      this.isLoading = true
      getAdminQnaList({
        searchType: this.searchType,
        keyword: this.keyword || undefined,
        registeredFrom: this.registeredFrom || undefined,
        registeredTo: this.registeredTo || undefined,
        answerYns: this.selectedAnswerYns.length ? this.selectedAnswerYns.join(',') : undefined,
        page: this.currentPage,
        size: this.pageSize
      }).then(({ data }) => {
        this.qnaList = data.items
        this.totalCount = data.totalCount
      }).catch(error => {
        const body = error.response && error.response.data
        this.errorMessage = (body && body.ERROR_MSG) || '문의 목록을 불러오지 못했습니다.'
      }).finally(() => {
        this.isLoading = false
      })
    },
    searchQna () {
      this.currentPage = 1
      this.loadQna()
    },
    resetFilters () {
      this.searchType = 'QNA_TITLE'
      this.keyword = ''
      this.registeredFrom = ''
      this.registeredTo = ''
      this.selectedAnswerYns = []
      this.currentPage = 1
      this.pageSize = 20
      this.loadQna()
    },
    changePageSize () {
      this.currentPage = 1
      this.loadQna()
    },
    changePage (pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) return
      this.currentPage = pageNumber
      this.loadQna()
    },
    formatDateTime (value) {
      return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.search-panel { margin-top: 36px; padding: 26px; border: 1px solid #d7e2df; background: #fff; }
.primary-filters { display: grid; grid-template-columns: 160px minmax(220px, 1fr) 220px 220px; gap: 16px; }
label { display: flex; flex-direction: column; gap: 8px; color: #536a66; font-size: 11px; font-weight: 700; }
input, select { min-width: 0; padding: 12px; box-sizing: border-box; border: 1px solid #cbd8d5; background: #fff; }
.advanced-filters { margin-top: 18px; max-width: 320px; }
details { position: relative; border: 1px solid #d5dfdd; }
summary { padding: 13px 14px; display: flex; justify-content: space-between; color: #405b57; font-size: 12px; font-weight: 700; cursor: pointer; list-style: none; }
summary span { color: #82938f; font-size: 10px; font-weight: 400; }
.checkbox-list { position: absolute; z-index: 3; top: 46px; left: -1px; right: -1px; padding: 14px; display: grid; gap: 11px; border: 1px solid #cbd8d5; background: #fff; box-shadow: 0 12px 28px rgba(20, 49, 57, .12); }
.checkbox-list label { flex-direction: row; align-items: center; }
.checkbox-list input { padding: 0; }
.search-actions { margin-top: 22px; display: flex; justify-content: center; gap: 8px; }
button { padding: 12px 22px; border: 0; background: #183c43; color: #fff; cursor: pointer; }
.reset-button { border: 1px solid #b9cac6; background: #fff; color: #526c68; }
.result-header { margin: 28px 0 12px; display: flex; align-items: center; justify-content: space-between; }
.result-header > div { display: flex; align-items: baseline; gap: 10px; }
.result-header span { color: #728682; font-size: 11px; }
.result-header > label { flex-direction: row; align-items: center; white-space: nowrap; }
.result-header select { padding: 10px 30px 10px 10px; }
.table-wrap { overflow-x: auto; background: #fff; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 12px; }
th { color: #718682; text-align: left; }
td a { color: #163b43; font-weight: 700; text-decoration: none; }
.answer-status { color: #a35252; }
.answer-status.complete { color: #4d827b; }
.empty { padding: 50px; text-align: center; }
.pagination { margin-top: 22px; display: flex; justify-content: center; gap: 6px; }
.pagination button { min-width: 38px; padding: 10px 12px; border: 1px solid #cbd8d5; background: #fff; color: #526c68; }
.pagination button.active { border-color: #183c43; background: #183c43; color: #fff; }
.pagination button:disabled { opacity: .4; cursor: default; }
.error { color: #b14949; }
@media (max-width: 1100px) { .primary-filters { grid-template-columns: 1fr 2fr; } }
@media (max-width: 650px) { .primary-filters { grid-template-columns: 1fr; } .result-header { align-items: flex-start; gap: 12px; flex-direction: column; } }
</style>
