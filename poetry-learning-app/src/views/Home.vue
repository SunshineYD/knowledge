<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
    <div class="text-center mb-8">
      <h1 class="text-4xl md:text-5xl font-bold text-primary mb-4">
        诗歌背诵打卡
      </h1>
      <p class="text-lg text-gray-600 mb-6">
        让孩子在快乐中学习诗歌，培养文学素养
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/login" class="btn-cartoon bg-primary">
          登录
        </router-link>
        <router-link to="/register" class="btn-cartoon bg-secondary">
          注册
        </router-link>
      </div>
    </div>
    
    <div class="w-full max-w-4xl mt-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card-cartoon bg-white border-4 border-primary">
          <div class="text-center p-4">
            <div class="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl">👶</span>
            </div>
            <h3 class="text-xl font-bold text-primary mb-2">孩子管理</h3>
            <p class="text-gray-600">添加和管理多个孩子的学习进度</p>
          </div>
        </div>
        
        <div class="card-cartoon bg-white border-4 border-secondary">
          <div class="text-center p-4">
            <div class="w-16 h-16 bg-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl">📝</span>
            </div>
            <h3 class="text-xl font-bold text-secondary mb-2">诗歌卡片</h3>
            <p class="text-gray-600">查看诗歌打卡状态和熟悉度</p>
          </div>
        </div>
        
        <div class="card-cartoon bg-white border-4 border-accent">
          <div class="text-center p-4">
            <div class="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl">➕</span>
            </div>
            <h3 class="text-xl font-bold text-accent mb-2">添加诗歌</h3>
            <p class="text-gray-600">上传图片或手动输入诗歌内容</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>