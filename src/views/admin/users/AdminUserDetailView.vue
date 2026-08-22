<template>
  <admin-goods-layout title="회원 상세">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <section v-if="user" class="content-panel">
      <h2>{{ user.userName }}</h2>
      <form @submit.prevent="save"><dl><dt>회원번호</dt><dd>{{ user.userNo }}</dd><dt>아이디</dt><dd>{{ user.userId }}</dd><dt>이름</dt><dd>{{ user.userName }}</dd><dt>연락처</dt><dd><input v-model.trim="form.userPhone"></dd><dt>등급</dt><dd><input v-model.trim="form.userGrade"></dd><dt>상태</dt><dd><input v-model.trim="form.userStatus"></dd></dl><button :disabled="isSaving">{{ isSaving ? '저장 중...' : '저장' }}</button></form>
    </section>
    <router-link class="back" :to="{ name: 'adminUserList' }">목록으로</router-link>
  </admin-goods-layout>
</template>
<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminUser, updateAdminUser } from '@/api/admin'
export default { name: 'AdminUserDetailView', components: { AdminGoodsLayout }, data: () => ({ user: null, form: {}, isSaving: false, errorMessage: '' }), created () { this.load() }, methods: { load () { getAdminUser(this.$route.params.userNo).then(({ data }) => { this.user = data; this.form = { userPhone: data.userPhone || '', userGrade: data.userGrade || '', userStatus: data.userStatus || '' } }).catch(() => { this.errorMessage = '회원 정보를 불러오지 못했습니다.' }) }, save () { this.isSaving = true; updateAdminUser(this.user.userNo, this.form).then(() => this.load()).catch(() => { this.errorMessage = '저장에 실패했습니다.' }).finally(() => { this.isSaving = false }) } } }
</script>
<style scoped> .content-panel{margin-top:30px;padding:28px;background:#fff;border:1px solid #dce5e3}dl{display:grid;grid-template-columns:160px 1fr}dt,dd{margin:0;padding:14px;border-bottom:1px solid #e1e8e6}input{width:100%;max-width:360px;box-sizing:border-box;padding:9px}button,.back{display:inline-block;margin-top:20px;padding:12px 20px;background:#183c43;color:#fff;border:0;text-decoration:none}.error{color:#b14949}</style>
