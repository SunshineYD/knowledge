<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="card-cartoon bg-white p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">登录</h1>
          <p class="text-gray-600">欢迎回到诗歌背诵打卡</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-gray-700 font-bold mb-2">邮箱</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入邮箱"
              required
            >
          </div>
          
          <div>
            <label for="password" class="block text-gray-700 font-bold mb-2">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入密码"
              required
            >
          </div>
          
          <button type="submit" class="btn-cartoon bg-primary w-full">
            登录
          </button>
          
          <div class="text-center">
            <p class="text-gray-600">
              还没有账号？ <router-link to="/register" class="text-primary font-bold">注册</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin() {
      // 这里将实现登录逻辑
      console.log('登录表单提交:', this.form);
      // 模拟登录成功
      localStorage.setItem('token', 'mock-token');
      this.$router.push('/children');
    }
  }
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>