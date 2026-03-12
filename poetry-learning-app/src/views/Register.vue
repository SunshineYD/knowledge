<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="card-cartoon bg-white p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-primary mb-2">注册</h1>
          <p class="text-gray-600">创建新账号，开始诗歌学习之旅</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-gray-700 font-bold mb-2">姓名</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入姓名"
              required
            >
          </div>
          
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
          
          <div>
            <label for="confirmPassword" class="block text-gray-700 font-bold mb-2">确认密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="form.confirmPassword" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请确认密码"
              required
            >
          </div>
          
          <button type="submit" class="btn-cartoon bg-secondary w-full">
            注册
          </button>
          
          <div class="text-center">
            <p class="text-gray-600">
              已有账号？ <router-link to="/login" class="text-primary font-bold">登录</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleRegister() {
      // 这里将实现注册逻辑
      console.log('注册表单提交:', this.form);
      // 模拟注册成功
      localStorage.setItem('token', 'mock-token');
      this.$router.push('/children');
    }
  }
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>