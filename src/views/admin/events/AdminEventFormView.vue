<template>
  <admin-goods-layout :title="isEdit ? '이벤트 수정' : '이벤트 등록'">
    <form class="event-form" @submit.prevent="submit">
      <section>
        <h2>기본 정보</h2>
        <div class="grid">
          <label>이벤트 제목*<input v-model.trim="form.eventTitle" required></label>
          <label>메인 이미지 URL<input v-model.trim="form.mainImageUrl" placeholder="/images/event.jpg 또는 https://..."></label>
          <label>시작일*<input v-model="form.eventStartDate" type="datetime-local" required></label>
          <label>종료일*<input v-model="form.eventEndDate" type="datetime-local" required></label>
          <label>사용 여부<select v-model="form.useYn"><option value="Y">사용</option><option value="N">미사용</option></select></label>
          <label>전시 여부<select v-model="form.displayYn"><option value="Y">전시</option><option value="N">미전시</option></select></label>
        </div>
      </section>
      <section>
        <h2>이벤트 상품</h2>
        <label>상품 번호<small>여러 상품은 쉼표로 구분해 입력하세요.</small><input v-model.trim="goodsNosText" placeholder="1, 2, 3"></label>
      </section>
      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
      <div class="actions"><router-link :to="{ name: 'adminEventList' }">취소</router-link><button :disabled="isSaving">{{ isSaving ? '저장 중...' : '저장' }}</button></div>
    </form>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { createAdminEvent, getAdminEvent, updateAdminEvent } from '@/api/admin'

export default {
  name: 'AdminEventFormView',
  components: { AdminGoodsLayout },
  data: () => ({ form: { eventTitle: '', mainImageUrl: '', eventStartDate: '', eventEndDate: '', useYn: 'Y', displayYn: 'Y', goodsNos: [] }, goodsNosText: '', isSaving: false, errorMessage: '' }),
  computed: { isEdit () { return Boolean(this.$route.params.eventNo) } },
  created () { if (this.isEdit) this.load() },
  methods: {
    load () { getAdminEvent(this.$route.params.eventNo).then(({ data }) => { this.form = { ...data, eventStartDate: this.toInputDate(data.eventStartDate), eventEndDate: this.toInputDate(data.eventEndDate) }; this.goodsNosText = (data.goodsNos || []).join(', ') }).catch(() => { this.errorMessage = '이벤트 정보를 불러오지 못했습니다.' }) },
    toInputDate (value) { return value ? value.slice(0, 16) : '' },
    submit () {
      this.errorMessage = ''
      if (new Date(this.form.eventEndDate) < new Date(this.form.eventStartDate)) { this.errorMessage = '종료일은 시작일 이후로 입력해 주세요.'; return }
      const values = this.goodsNosText ? this.goodsNosText.split(',').map(value => Number(value.trim())) : []
      if (values.some(value => !Number.isInteger(value) || value <= 0)) { this.errorMessage = '상품 번호를 올바르게 입력해 주세요.'; return }
      const payload = { ...this.form, goodsNos: values }
      const request = this.isEdit ? updateAdminEvent(this.$route.params.eventNo, payload) : createAdminEvent(payload)
      this.isSaving = true
      request.then(() => this.$router.push({ name: 'adminEventList' })).catch(error => { const body = error.response && error.response.data; this.errorMessage = (body && body.ERROR_MSG) || '이벤트 저장에 실패했습니다.' }).finally(() => { this.isSaving = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.event-form { margin-top: 36px; } section { margin-bottom: 20px; padding: 28px; border: 1px solid #dce5e3; background: #fff; } h2 { margin: 0 0 22px; font-size: 17px; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 22px; } label { display: flex; flex-direction: column; gap: 8px; color: #49615e; font-size: 12px; font-weight: 700; } input,select { box-sizing: border-box; width: 100%; padding: 12px; border: 1px solid #cbd8d5; background: #fff; font: inherit; } small { color: #879894; font-weight: 400; } .actions { display: flex; justify-content: flex-end; gap: 10px; } .actions a,.actions button { padding: 13px 24px; border: 1px solid #183c43; background: #fff; color: #183c43; text-decoration: none; cursor: pointer; } .actions button { background: #183c43; color: #fff; } .error { color: #b14949; } @media(max-width:700px){.grid{grid-template-columns:1fr}}
</style>
