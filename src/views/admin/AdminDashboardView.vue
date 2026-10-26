<template>
  <div class="admin-dashboard">
    <a class="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <admin-sidebar />

    <main id="main-content" tabindex="-1">
      <header>
        <div>
          <p>OPERATIONS / OVERVIEW</p>
          <h1>관리자 대시보드</h1>
        </div>
        <div class="admin-profile">
          <span>{{ adminInitial }}</span>
          <div>
            <strong>{{ adminName || '관리자' }}</strong>
            <p>{{ adminDepartment || '운영 부서' }} · {{ adminPosition || '관리자' }}</p>
          </div>
          <button type="button" :disabled="isLoggingOut" @click="logout">로그아웃</button>
        </div>
      </header>

      <section id="overview" class="welcome-panel">
        <div>
          <p>WELCOME BACK</p>
          <h2>오늘의 상점 운영을<br>차분하게 시작하세요.</h2>
        </div>
        <span>{{ currentDate }}</span>
      </section>

      <section class="summary-grid" aria-label="관리 바로가기">
        <article v-for="item in summaryItems" :key="item.label">
          <router-link :to="{ name: item.routeName }">
            <p>{{ item.label }}</p>
            <strong>{{ item.value }}</strong>
            <span>{{ item.description }} →</span>
          </router-link>
        </article>
      </section>

      <section class="empty-panel">
        <p>ADMIN WORKSPACE</p>
        <h2>필요한 업무로 바로 이동하세요.</h2>
        <span>상품, 이벤트, 회원과 문의 관리는 왼쪽 메뉴에서 확인할 수 있습니다.</span>
      </section>
    </main>
  </div>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

export default {
  name: 'AdminDashboardView',
  components: { AdminSidebar },
  data () {
    return {
      isLoggingOut: false,
      summaryItems: [
        { label: '상품 관리', value: 'GOODS', description: '상품 조회와 등록', routeName: 'adminGoodsList' },
        { label: '회원 관리', value: 'MEMBERS', description: '회원 정보 조회', routeName: 'adminUserList' },
        { label: '문의 관리', value: 'INQUIRIES', description: '문의 확인과 답변', routeName: 'adminQnaList' }
      ]
    }
  },
  computed: {
    adminName () {
      return this.$store.state.admin.adminName || localStorage.getItem('adminName')
    },
    adminDepartment () {
      return this.$store.state.admin.adminDepartment || localStorage.getItem('adminDepartment')
    },
    adminPosition () {
      return this.$store.state.admin.adminPosition || localStorage.getItem('adminPosition')
    },
    adminInitial () {
      return this.adminName ? this.adminName.charAt(0) : 'A'
    },
    currentDate () {
      return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long' }).format(new Date())
    }
  },
  methods: {
    logout () {
      this.isLoggingOut = true
      this.$store.dispatch('admin/logout').catch(() => {
        alert('서버 로그아웃에 실패했습니다. 이 기기의 로그인 정보는 삭제되었습니다.')
      }).finally(() => {
        this.isLoggingOut = false
        this.$router.replace({ name: 'adminLogin' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  background: var(--color-background);
  color: var(--color-foreground);
  text-align: left;
}

main {
  min-width: 0;
  padding: 42px 48px 64px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header p,
.welcome-panel p,
.empty-panel > p {
  margin: 0 0 8px;
  color: var(--color-muted-foreground);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

header h1 {
  margin: 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 34px;
  font-weight: 400;
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-profile > span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #d7e5e2;
  font-weight: 800;
}

.admin-profile strong {
  font-size: 14px;
}

.admin-profile p {
  margin: 4px 0 0;
  letter-spacing: 0;
  font-size: 14px;
}

.admin-profile button {
  margin-left: 12px;
  padding: 8px 12px;
  border: 1px solid #c9d6d3;
  background: #fff;
  color: #526c68;
  font-size: 14px;
  cursor: pointer;
}

.welcome-panel {
  min-height: 220px;
  margin-top: 48px;
  padding: 42px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--color-primary);
  color: #fff;
}

.welcome-panel h2 {
  margin: 18px 0 0;
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: 34px;
  font-weight: 400;
  line-height: 1.35;
}

.welcome-panel > span {
  color: #9fc5be;
  font-size: 14px;
}

.summary-grid {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.summary-grid article {
  padding: 26px;
  border: 1px solid #dae4e2;
  background: #fff;
}

.summary-grid p {
  margin: 0;
  color: #839591;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.summary-grid strong {
  margin: 18px 0 8px;
  display: block;
  font-family: Georgia, serif;
  font-size: 28px;
  font-weight: 400;
}

.summary-grid span,
.empty-panel span {
  color: #7b8d89;
  font-size: 14px;
}

.empty-panel {
  margin-top: 22px;
  padding: 34px;
  border: 1px dashed #c3d2cf;
  background: rgba(255, 255, 255, 0.45);
}

.empty-panel h2 {
  margin: 10px 0;
  font-size: 17px;
}

@media (max-width: 800px) {
  .admin-dashboard {
    grid-template-columns: minmax(0, 1fr);
  }

  main {
    padding: 32px 22px;
  }

  header,
  .welcome-panel {
    gap: 24px;
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.welcome-panel, .summary-grid article, .empty-panel { border-radius: var(--radius-card); }
.welcome-panel p { color: #c0d9cd; }

.summary-grid article { padding: 0; }
.summary-grid a { display: block; height: 100%; padding: 26px; color: inherit; text-decoration: none; border-radius: var(--radius-card); }
.summary-grid a:hover { background: #eaf1eb; }
</style>
