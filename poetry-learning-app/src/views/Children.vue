<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-primary">孩子管理</h1>
        <button @click="showAddChildModal = true" class="btn-cartoon bg-secondary">
          添加孩子
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="child in children" 
          :key="child.id"
          class="card-cartoon bg-white border-4" 
          :class="selectedChildId === child.id ? 'border-primary' : 'border-gray-300'"
          @click="selectChild(child.id)"
        >
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xl">{{ child.name.charAt(0) }}</span>
                </div>
                <div>
                  <h3 class="text-xl font-bold">{{ child.name }}</h3>
                  <p class="text-gray-600">{{ child.age }}岁</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click.stop="editChild(child)" class="text-primary">✏️</button>
                <button @click.stop="deleteChild(child.id)" class="text-danger">🗑️</button>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">已学习诗歌: {{ child.learnedPoems }}</span>
              <span class="text-gray-600">连续打卡: {{ child.streak }}天</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加孩子模态框 -->
      <div v-if="showAddChildModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 class="text-2xl font-bold text-primary mb-4">添加孩子</h2>
          <form @submit.prevent="addChild" class="space-y-4">
            <div>
              <label for="childName" class="block text-gray-700 font-bold mb-2">姓名</label>
              <input 
                type="text" 
                id="childName" 
                v-model="newChild.name" 
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入孩子姓名"
                required
              >
            </div>
            <div>
              <label for="childAge" class="block text-gray-700 font-bold mb-2">年龄</label>
              <input 
                type="number" 
                id="childAge" 
                v-model="newChild.age" 
                class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入孩子年龄"
                min="6"
                max="10"
                required
              >
            </div>
            <div class="flex gap-4">
              <button type="button" @click="showAddChildModal = false" class="flex-1 btn-cartoon bg-gray-500">
                取消
              </button>
              <button type="submit" class="flex-1 btn-cartoon bg-secondary">
                保存
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- 底部导航 -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 flex justify-around py-3">
        <router-link to="/" class="flex flex-col items-center text-gray-600 hover:text-primary">
          <span class="text-2xl">🏠</span>
          <span class="text-sm">首页</span>
        </router-link>
        <router-link to="/children" class="flex flex-col items-center text-primary font-bold">
          <span class="text-2xl">👶</span>
          <span class="text-sm">孩子</span>
        </router-link>
        <router-link to="/poems" class="flex flex-col items-center text-gray-600 hover:text-primary">
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
  name: 'Children',
  data() {
    return {
      children: [
        {
          id: 1,
          name: '小明',
          age: 8,
          learnedPoems: 5,
          streak: 3
        },
        {
          id: 2,
          name: '小红',
          age: 6,
          learnedPoems: 2,
          streak: 1
        }
      ],
      selectedChildId: 1,
      showAddChildModal: false,
      newChild: {
        name: '',
        age: ''
      }
    }
  },
  methods: {
    selectChild(childId) {
      this.selectedChildId = childId;
    },
    addChild() {
      const newId = this.children.length + 1;
      this.children.push({
        id: newId,
        name: this.newChild.name,
        age: parseInt(this.newChild.age),
        learnedPoems: 0,
        streak: 0
      });
      this.showAddChildModal = false;
      this.newChild = { name: '', age: '' };
    },
    editChild(child) {
      // 编辑孩子逻辑
      console.log('编辑孩子:', child);
    },
    deleteChild(childId) {
      // 删除孩子逻辑
      this.children = this.children.filter(child => child.id !== childId);
      if (this.selectedChildId === childId && this.children.length > 0) {
        this.selectedChildId = this.children[0].id;
      }
    }
  }
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>