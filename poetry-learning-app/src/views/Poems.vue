<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 pb-20">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary">诗歌卡片</h1>
        <div class="flex gap-2">
          <button @click="filter = 'all'" class="btn-cartoon" :class="filter === 'all' ? 'bg-primary' : 'bg-gray-500'">
            全部
          </button>
          <button @click="filter = 'completed'" class="btn-cartoon" :class="filter === 'completed' ? 'bg-primary' : 'bg-gray-500'">
            已打卡
          </button>
          <button @click="filter = 'pending'" class="btn-cartoon" :class="filter === 'pending' ? 'bg-primary' : 'bg-gray-500'">
            未打卡
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="poem in filteredPoems" 
          :key="poem.id"
          class="card-cartoon bg-white"
        >
          <div class="p-4">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold text-primary">{{ poem.title }}</h3>
              <span 
                class="px-3 py-1 rounded-full text-sm font-bold"
                :class="poem.completed ? 'bg-success text-white' : 'bg-warning text-white'"
              >
                {{ poem.completed ? '已打卡' : '未打卡' }}
              </span>
            </div>
            
            <div class="mb-4">
              <p class="text-gray-700 mb-2">{{ poem.content }}</p>
              <p class="text-gray-500 text-sm">{{ poem.pinyin }}</p>
            </div>
            
            <div class="mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-700 font-bold">熟悉度</span>
                <div class="flex gap-1">
                  <span 
                    v-for="i in 5" 
                    :key="i"
                    class="text-xl cursor-pointer"
                    :class="i <= poem.familiarity ? 'text-accent' : 'text-gray-300'"
                    @click="updateFamiliarity(poem.id, i)"
                  >
                    ⭐
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex gap-2">
              <button 
                @click="toggleComplete(poem.id)" 
                class="btn-cartoon flex-1" 
                :class="poem.completed ? 'bg-gray-500' : 'bg-success'"
              >
                {{ poem.completed ? '取消打卡' : '打卡' }}
              </button>
              <button @click="deletePoem(poem.id)" class="btn-cartoon bg-danger">
                删除
              </button>
            </div>
          </div>
        </div>
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
        <router-link to="/poems" class="flex flex-col items-center text-primary font-bold">
          <span class="text-2xl">📝</span>
          <span class="text-sm">诗歌</span>
        </router-link>
        <router-link to="/add-poem" class="flex flex-col items-center text-gray-600 hover:text-primary">
          <span class="text-2xl">➕</span>
          <span class="text-sm">添加</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Poems',
  data() {
    return {
      poems: [
        {
          id: 1,
          title: '静夜思',
          content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
          pinyin: 'Chuáng qián míng yuè guāng, yí shì dì shàng shuāng. Jǔ tóu wàng míng yuè, dī tóu sī gù xiāng.',
          completed: true,
          familiarity: 5
        },
        {
          id: 2,
          title: '春晓',
          content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
          pinyin: 'Chūn mián bù jué xiǎo, chù chù wén tí niǎo. Yè lái fēng yǔ shēng, huā luò zhī duō shǎo.',
          completed: false,
          familiarity: 3
        },
        {
          id: 3,
          title: '望庐山瀑布',
          content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。',
          pinyin: 'Rì zhào xiāng lú shēng zǐ yān, yáo kàn pù bù guà qián chuān. Fēi liú zhí xià sān qiān chǐ, yí shì yín hé luò jiǔ tiān.',
          completed: false,
          familiarity: 2
        }
      ],
      filter: 'all'
    }
  },
  computed: {
    filteredPoems() {
      if (this.filter === 'all') {
        return this.poems;
      } else if (this.filter === 'completed') {
        return this.poems.filter(poem => poem.completed);
      } else if (this.filter === 'pending') {
        return this.poems.filter(poem => !poem.completed);
      }
    }
  },
  methods: {
    toggleComplete(poemId) {
      const poem = this.poems.find(p => p.id === poemId);
      if (poem) {
        poem.completed = !poem.completed;
      }
    },
    updateFamiliarity(poemId, familiarity) {
      const poem = this.poems.find(p => p.id === poemId);
      if (poem) {
        poem.familiarity = familiarity;
      }
    },
    deletePoem(poemId) {
      this.poems = this.poems.filter(p => p.id !== poemId);
    }
  }
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>