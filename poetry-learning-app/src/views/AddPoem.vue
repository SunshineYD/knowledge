<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 pb-20">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary">添加诗歌</h1>
        <button @click="$router.back()" class="btn-cartoon bg-gray-500">
          返回
        </button>
      </div>
      
      <div class="card-cartoon bg-white p-6">
        <form @submit.prevent="addPoem" class="space-y-6">
          <div>
            <label for="title" class="block text-gray-700 font-bold mb-2">诗歌标题</label>
            <input 
              type="text" 
              id="title" 
              v-model="form.title" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入诗歌标题"
              required
            >
          </div>
          
          <div>
            <label for="content" class="block text-gray-700 font-bold mb-2">诗歌内容</label>
            <textarea 
              id="content" 
              v-model="form.content" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入诗歌内容"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div>
            <label for="pinyin" class="block text-gray-700 font-bold mb-2">拼音</label>
            <textarea 
              id="pinyin" 
              v-model="form.pinyin" 
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入诗歌拼音"
              rows="4"
              required
            ></textarea>
          </div>
          
          <div>
            <label class="block text-gray-700 font-bold mb-2">图片上传</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                class="hidden" 
                id="imageUpload"
              >
              <label for="imageUpload" class="cursor-pointer">
                <div class="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center mb-2">
                  <span v-if="!form.image" class="text-gray-400 text-xl">📷</span>
                  <img v-else :src="form.image" class="w-full h-full object-cover rounded-lg">
                </div>
                <p class="text-gray-600">点击上传图片</p>
              </label>
            </div>
          </div>
          
          <button type="submit" class="btn-cartoon bg-accent w-full">
            添加诗歌
          </button>
        </form>
      </div>
      
      <!-- 底部导航 -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 flex justify-around py-3">
        <router-link to="/" class="flex flex-col items-center text-gray-600 hover:text-primary">
          <span class="text-2xl">🏠</span>
          <span class="text-sm">首页</span>
        </router-link>
        <router-link to="/children" class="flex flex-col items-center text-gray-600 hover:text-primary">
          <span class="text-2xl">👶</span>
          <span class="text-sm">孩子</span>
        </router-link>
        <router-link to="/poems" class="flex flex-col items-center text-gray-600 hover:text-primary">
          <span class="text-2xl">📝</span>
          <span class="text-sm">诗歌</span>
        </router-link>
        <router-link to="/add-poem" class="flex flex-col items-center text-primary font-bold">
          <span class="text-2xl">➕</span>
          <span class="text-sm">添加</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPoem',
  data() {
    return {
      form: {
        title: '',
        content: '',
        pinyin: '',
        image: ''
      }
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    addPoem() {
      // 这里将实现添加诗歌逻辑
      console.log('添加诗歌:', this.form);
      // 模拟添加成功
      this.$router.push('/poems');
    }
  }
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>