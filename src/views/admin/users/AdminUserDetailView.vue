<template>
  <admin-goods-layout eyebrow="MEMBER MANAGEMENT" title="회원 상세">
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section v-if="user" class="content-panel"><div class="panel-header"><div><p>MEMBER PROFILE</p><h2>{{ user.userName }}</h2></div><span>읽기 전용</span></div><dl><template v-for="item in detailItems"><dt :key="`${item.label}-dt`">{{ item.label }}</dt><dd :key="`${item.label}-dd`">{{ item.value }}</dd></template></dl></section>
    <router-link class="back" :to="{ name: 'adminUserList' }">목록으로</router-link>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdminUser } from '@/api/admin'

export default {
  name: 'AdminUserDetailView',
  components: { AdminGoodsLayout },
  data: () => ({ user: null, errorMessage: '' }),
  computed: {
    detailItems () {
      const user = this.user
      return [{ label: '회원번호', value: user.userNo }, { label: '아이디', value: user.userId }, { label: '이름', value: user.userName }, { label: '연락처', value: user.userPhone || '-' }, { label: '등급', value: user.userGrade }, { label: '상태', value: user.userStatus }, { label: '가입일', value: this.formatDateTime(user.regDate) }, { label: '최종 수정일', value: this.formatDateTime(user.updtDate) }]
    }
  },
  created () {
    getAdminUser(this.$route.params.userNo).then(({ data }) => {
      this.user = data
    }).catch(() => {
      this.errorMessage = '회원 정보를 불러오지 못했습니다.'
    })
  },
  methods: {
    formatDateTime (value) {
      return value ? new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.content-panel { margin-top: 36px; padding: 28px; border: 1px solid #dce5e3; background: #fff; } .panel-header { display: flex; align-items: end; justify-content: space-between; margin-bottom: 22px; } .panel-header p { margin: 0 0 6px; color: #78908c; font-size: 10px; font-weight: 800; letter-spacing: .16em; } .panel-header h2 { margin: 0; font-size: 24px; } .panel-header span { padding: 7px 10px; background: #edf2f1; color: #526c68; font-size: 11px; } dl { display: grid; grid-template-columns: 180px 1fr; } dt,dd { margin: 0; padding: 14px; border-bottom: 1px solid #e1e8e6; font-size: 13px; } dt { color: #718682; } .back { margin-top: 20px; padding: 12px 20px; display: inline-block; background: #183c43; color: #fff; text-decoration: none; } .error { margin-top: 24px; color: #b14949; } @media(max-width:650px){.content-panel{padding:18px}dl{grid-template-columns:1fr}dt{padding-bottom:5px;border-bottom:0}dd{padding-top:5px}}
</style>
