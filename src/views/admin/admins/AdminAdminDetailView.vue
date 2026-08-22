<template>
  <admin-goods-layout eyebrow="ADMINISTRATOR MANAGEMENT" title="관리자 상세">
    <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>
    <section v-if="admin" class="content-panel"><div class="panel-header"><div><p>ADMINISTRATOR PROFILE</p><h2>{{ admin.adminName }}</h2></div><span>읽기 전용</span></div><dl><template v-for="item in detailItems"><dt :key="`${item.label}-dt`">{{ item.label }}</dt><dd :key="`${item.label}-dd`">{{ item.value }}</dd></template></dl></section>
    <router-link class="back" :to="{ name: 'adminAdminList' }">목록으로</router-link>
  </admin-goods-layout>
</template>

<script>
import AdminGoodsLayout from '@/components/admin/AdminGoodsLayout.vue'
import { getAdmin } from '@/api/admin'

export default {
  name: 'AdminAdminDetailView',
  components: { AdminGoodsLayout },
  data: () => ({ admin: null, errorMessage: '' }),
  computed: {
    detailItems () {
      const admin = this.admin
      return [{ label: '관리자번호', value: admin.adminNo }, { label: '아이디', value: admin.adminId }, { label: '이름', value: admin.adminName }, { label: '연락처', value: admin.adminPhone || '-' }, { label: '부서', value: admin.adminDepartment || '-' }, { label: '직책', value: admin.adminPosition || '-' }, { label: '상태', value: admin.adminStatus }, { label: '사용 여부', value: admin.useYn }, { label: '등록일', value: this.formatDateTime(admin.regDate) }, { label: '최종 수정일', value: this.formatDateTime(admin.updtDate) }]
    }
  },
  created () {
    getAdmin(this.$route.params.adminNo).then(({ data }) => {
      this.admin = data
    }).catch(() => {
      this.errorMessage = '관리자 정보를 불러오지 못했습니다.'
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
