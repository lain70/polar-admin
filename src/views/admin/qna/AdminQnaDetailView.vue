<template>
  <admin-goods-layout title="문의 상세">
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <template v-if="qna">
      <section class="summary">
        <div><p class="eyebrow">INQUIRY NO. {{ qna.qnaNo }}</p><h2>{{ qna.qnaTitle }}</h2><p class="status" :class="{ complete: qna.answerYn === 'Y' }">{{ qna.answerYn === 'Y' ? '답변 완료' : '답변 대기' }}</p></div>
        <dl><div><dt>작성자</dt><dd>{{ qna.qnaUserId || '-' }}</dd></div><div><dt>등록일시</dt><dd>{{ formatDateTime(qna.regDate) }}</dd></div><div><dt>수정일시</dt><dd>{{ formatDateTime(qna.updtDate) }}</dd></div></dl>
      </section>
      <section class="content-card"><h2>문의 내용</h2><p>{{ qna.qnaContents }}</p></section>
      <section class="content-card reply-card"><div class="section-heading"><div><p class="eyebrow">CUSTOMER SUPPORT</p><h2>답변 작성</h2></div><span v-if="qna.qnaReplyNo">답변 수정</span><span v-else>새 답변</span></div><label>답변 내용<textarea v-model.trim="replyContents" rows="10" placeholder="문의에 대한 답변을 입력해 주세요."></textarea></label><p v-if="saveError" class="error" role="alert">{{ saveError }}</p><div class="actions"><router-link :to="{ name: 'adminQnaList' }">목록으로</router-link><button type="button" :disabled="isSaving || !replyContents" @click="saveReply">{{ isSaving ? '저장 중' : (qna.qnaReplyNo ? '답변 수정' : '답변 저장') }}</button></div></section>
    </template>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminQna, saveAdminQnaReply } from '@/api/admin'

export default {
  name: 'AdminQnaDetailView',
  components: { AdminGoodsLayout },
  data: () => ({ qna: null, replyContents: '', errorMessage: '', saveError: '', isSaving: false }),
  created () {
    this.loadQna()
  },
  methods: {
    loadQna () {
      getAdminQna(this.$route.params.qnaNo).then(({ data }) => { this.qna = data; this.replyContents = data.qnaReplyContents || '' }).catch(error => { const body = error.response && error.response.data; this.errorMessage = (body && body.ERROR_MSG) || '문의 내용을 불러오지 못했습니다.' })
    },
    saveReply () {
      this.saveError = ''
      this.isSaving = true
      saveAdminQnaReply(this.qna.qnaNo, { qnaReplyContents: this.replyContents }).then(() => { alert(this.qna.qnaReplyNo ? '답변이 수정되었습니다.' : '답변이 등록되었습니다.'); return this.loadQna() }).catch(error => { const body = error.response && error.response.data; this.saveError = (body && body.ERROR_MSG) || '답변 저장에 실패했습니다.' }).finally(() => { this.isSaving = false })
    },
    formatDateTime (value) {
      return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
section { margin-top: 24px; padding: 28px; border: 1px solid #dce5e3; background: #fff; }
.summary { margin-top: 36px; display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start; }
.eyebrow { margin: 0 0 10px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; }
.summary h2, .content-card h2 { margin: 0; font-family: Georgia, 'Noto Serif KR', serif; font-size: 28px; font-weight: 400; }
.summary .status { display: inline-block; margin: 22px 0 0; padding: 7px 10px; background: #f3e1df; color: #a35252; font-size: 11px; }
.summary .status.complete { background: #dceae7; color: #4d827b; }
dl { margin: 0; }
dl div { display: grid; grid-template-columns: 100px 1fr; border-bottom: 1px solid #e5ebe9; }
dt, dd { margin: 0; padding: 13px; font-size: 12px; }
dt { color: #748783; } dd { color: #29484d; }
.content-card p { margin: 26px 0 0; color: #52676a; line-height: 1.9; white-space: pre-wrap; }
.reply-card { padding: 32px; }
.section-heading { display: flex; align-items: flex-end; justify-content: space-between; }
.section-heading > span { color: #78908c; font-size: 11px; }
.reply-card label { margin-top: 28px; display: flex; flex-direction: column; gap: 9px; color: #536a66; font-size: 11px; font-weight: 700; }
textarea { min-height: 190px; padding: 14px; border: 1px solid #cbd8d5; color: #29484d; font: inherit; line-height: 1.7; resize: vertical; }
.actions { margin-top: 20px; display: flex; justify-content: flex-end; gap: 8px; }
.actions a, .actions button { padding: 12px 22px; border: 1px solid #b9cac6; background: #fff; color: #526c68; text-decoration: none; cursor: pointer; }
.actions button { border-color: #183c43; background: #183c43; color: #fff; }
.actions button:disabled { cursor: wait; opacity: .55; }
.error { color: #b14949; }
@media (max-width: 800px) { .summary { grid-template-columns: 1fr; gap: 24px; } }
</style>
