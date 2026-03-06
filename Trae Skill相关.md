在 **Trae**（通常指字节系 / AI IDE Trae）里，**Skill（技能）本质上是「可被模型调用的一组能力封装」**，它不是简单的一段代码，而是**以“声明 + 实现 + 约束”的组合形式存在**。

下面按**从抽象到具体**给你说明，一般业界对 Trae 中 Skill 的理解也基本是这个结构。

---

## 一、一句话总结

> **Trae 中的 Skill 通常以「结构化能力定义（Schema / Manifest）+ 可执行实现（函数 / 插件）+ 调用约束」的形式存在**，用于被大模型在对话或任务执行中**自动或半自动调用**。

---

## 二、Skill 的常见存在形式（从外到内）

### ✅ 1️⃣ Skill 的「定义层」（最关键）

这是 **给大模型“看的”那一层**，通常是**结构化描述**，常见形式包括：

- JSON / YAML / TS Schema
- Tool / Function 的描述协议（类似 OpenAI function calling）

📌 核心作用：  
> 告诉模型：  
> **「我有什么能力」+「什么时候用」+「怎么用」**

#### 示例（伪代码）

```json
{
  "name": "search_codebase",
  "description": "在当前项目代码中搜索相关函数或文件",
  "parameters": {
    "type": "object",
    "properties": {
      "keyword": {
        "type": "string",
        "description": "要搜索的关键词"
      }
    },
    "required": ["keyword"]
  }
}
```

这部分 **不是逻辑实现**，而是：
- 能力说明
- 参数约束
- 供模型决策调用

---

### ✅ 2️⃣ Skill 的「实现层」（真正执行能力）

定义背后一定有**可执行实体**，比如：

- 一个 JS / TS / Python 函数
- IDE 内部命令
- RPC / HTTP API
- 插件暴露的 Command

📌 本质：
> **模型 ≠ 执行者**  
> **Trae 才是执行者**

示例：

```ts
async function searchCodebase(keyword: string) {
  return await ide.search(keyword)
}
```

模型只负责：
- 要不要用
- 传什么参数

---

### ✅ 3️⃣ Skill 的「调用契约 / 限制」

为了防止模型乱用，Skill 通常还带有：

- 调用频率限制
- 作用域限制（只读 / 写文件）
- 上下文依赖（是否需要代码选区 / 当前文件）
- 成本限制（比如必须高置信度才能调用）

这些信息可能：
- 写在 manifest 中
- 或写在 Trae 内部的 Skill registry

---

## 三、在 Trae 中 Skill 通常被谁管理？

在实际系统里，一般有一个 **Skill Registry（技能注册中心）**，负责：

- 注册所有可用 skill
- 暴露给模型
- 管理权限与版本

逻辑结构类似：

```ts
registerSkill({
  name: 'create_file',
  description: '创建新文件',
  scope: 'write',
  handler: createFile
})
```

---

## 四、Skill vs Prompt 的区别（很多人会混）

| 对比项 | Prompt | Skill |
|---|---|---|
| 本质 | 文本指令 | 结构化能力 |
| 是否可执行 | ❌ | ✅ |
| 模型是否调用 | 只能“理解” | 能“决定是否调用” |
| 有无参数约束 | ❌ | ✅ |
| 可靠性 | 低 | 高 |

✅ 在 Trae 中，**Skill 是比 Prompt 更“硬”的能力单位**。

---

## 五、总结一句更工程向的描述

> **Trae 的 Skill 通常是：**
>
> - 以 **Schema（JSON / TS）形式声明**
> - 绑定一个 **可执行函数 / IDE 命令**
> - 由系统管理、供模型按需调用的 **原子能力单元**

---

如果你愿意，我也可以进一步帮你拆：

- ✅ Trae 的 Skill 和 OpenAI Tools / Function Calling 的对应关系  
- ✅ 如何自己实现一个 Trae Skill（从 0 到可被模型调用）  
- ✅ Skill 设计上如何做到「不被模型乱用」

👉 **“如何自己实现一个 Trae Skill（从 0 到可被模型调用）”**

下面我用一种**工程视角、可落地的方式**，带你从 **0 → 可被模型调用**，完整走一遍 **Trae Skill 的实现流程**。  
（不依赖 Trae 私有实现细节，用**通用 IDE / Agent Skill 架构**讲，基本等价）

---

# 一、先给你一个「总体心智模型」

> **Skill = 声明（给模型看） + 实现（给系统用） + 注册（让模型能选到）**

```text
┌────────────┐
│  LLM 判断  │
│ 要不要用  │
└─────┬──────┘
      │ (Schema)
┌─────▼──────┐
│ Skill 定义 │  ← JSON / TS 描述
└─────┬──────┘
      │ (参数)
┌─────▼──────┐
│ Skill 执行 │  ← 函数 / 命令 / API
└─────┬──────┘
      │
┌─────▼──────┐
│   返回结果 │
└────────────┘
```

---

# 二、Step 1：确定这个 Skill 要“干什么”

📌 原则：  
**一个 Skill = 一个“稳定、原子、可复用动作”**

❌ 反例：
- “帮我修这个 bug”
- “完整生成一个功能模块”

✅ 正例：
- 在项目中搜索关键词
- 创建文件
- 读取当前选区
- 执行命令行
- 调用内部 API

### 示例目标
我们实现一个 Skill：

> **`search_codebase`：在当前项目中搜索字符串**

---

# 三、Step 2：定义 Skill Schema（给模型看的）

这是**最重要的一步**，也是模型是否“会用”的关键。

### 1️⃣ Skill 的基本字段

```ts
interface SkillSchema {
  name: string
  description: string
  parameters: JSONSchema
}
```

### 2️⃣ 完整示例（强烈建议照这个结构）

```ts
export const searchCodebaseSkill = {
  name: "search_codebase",
  description: "Search for a keyword in the current project codebase",
  parameters: {
    type: "object",
    properties: {
      keyword: {
        type: "string",
        description: "The text to search for"
      },
      fileTypes: {
        type: "array",
        items: { type: "string" },
        description: "Optional file extensions to limit search"
      }
    },
    required: ["keyword"]
  }
}
```

📌 Schema 设计要点（非常重要）：

| 项 | 规则 |
|---|---|
| name | 动词 + 名词，简短、稳定 |
| description | **告诉模型“什么时候该用”** |
| 参数 | 少而明确 |
| required | 能不 required 就不 required |

---

# 四、Step 3：实现 Skill Handler（真正干活的）

模型永远不会**直接操作系统**，  
它只会调用你写的 **handler**。

### 示例（TS / Node 风格）

```ts
export async function searchCodebaseHandler(
  params: {
    keyword: string
    fileTypes?: string[]
  },
  context: SkillContext
) {
  const { keyword, fileTypes } = params

  const results = await context.ide.search({
    query: keyword,
    extensions: fileTypes
  })

  return {
    matches: results.map(r => ({
      file: r.filePath,
      line: r.line,
      preview: r.preview
    }))
  }
}
```

📌 返回值要求：
- ✅ JSON 可序列化
- ✅ 结构稳定
- ❌ 不要返回大段无结构文本

---

# 五、Step 4：注册 Skill（进 Skill Registry）

Trae / Agent 内部一定有一个 **Skill 注册机制**。

### 常见注册方式

```ts
registerSkill({
  schema: searchCodebaseSkill,
  handler: searchCodebaseHandler,
  permissions: {
    scope: "read"
  }
})
```

📌 这一层做三件事：

1. 让系统知道：
   - 有这个 Skill
2. 让模型知道：
   - 可以选它
3. 控制：
   - 权限 / 风险 / 使用条件

---

# 六、Step 5：让模型“学会”用它

### ✅ 关键不是训练，而是**描述**

模型是否会调用，80% 取决于：

- description 写得好不好
- 参数是否好拆
- 是否和用户意图对齐

❌ 坏 description：
> “Search code”

✅ 好 description：
> “Use this to find existing functions, variables, or files in the current project before modifying code”

---

# 七、Step 6：从 Prompt 到 Skill 调用（系统行为）

当用户说：

> “帮我看看这个函数定义在哪里”

模型内部步骤是：

1. 理解意图
2. 发现 Skill `search_codebase` 匹配
3. 生成参数
4. 输出一个 **function call**
5. Trae 执行 handler
6. 把结果返回模型
7. 模型继续生成自然语言回应

---

# 八、Step 7：调试一个 Skill 的“是否好用”

### ✅ 检查清单

- [ ] 模型会不会乱用？
- [ ] 会不会在该用时不用？
- [ ] 参数是不是经常填错？
- [ ] 返回结构是否稳定？

### ✅ 调优手段

- 改 description（最有效）
- 精简参数
- 拆 Skill（一个太多事就拆）

---

# 九、进阶：一个「好 Skill」的 5 条铁律

1. **原子性**：只做一件事  
2. **低推理负担**：参数不用模型算  
3. **确定性输出**：可预测  
4. **失败可恢复**：错误要返回结构化信息  
5. **权限最小化**：别轻易给写权限

---

# 十、总结一句话

> **实现一个 Trae Skill = 设计一个“模型可理解、系统可执行”的原子能力单元**  
> 核心在 **Schema（对模型友好）而不是代码本身**。

---

如果你愿意，我可以下一步直接帮你：

- ✅ 设计 **一个真实可用的 Trae Skill（针对你的场景）**
- ✅ 帮你制定 **Skill 命名 & 设计规范**
- ✅ 把多个 Skill 组织成 **Agent 能力树**


👉 **“那从类比的角度来看，skill是否可以理解为与utils文件中的函数是一类的性质，单一职责。”**

是的 ✅——**这个类比在“设计哲学层面”是完全成立的**，而且还是一个**非常好的理解方式**。  
但需要补一句「**相同中有关键差异**」，这点决定了你 *Skill 会不会好用、安不安全*。

下面我用 **utils 函数 ↔ Skill** 的**一一类比**来讲清楚。

---

## 一句话先给结论

> **Skill ≈ 面向模型调用的 `utils` 函数**  
> 但它是 **“外部可见 + 高约束 + 带权限边界”** 的 utils。

---

## 一、强对应点（为什么这个类比是对的）

| utils 函数 | Skill |
|-----------|-------|
| 单一职责 | ✅ 必须单一职责 |
| 行为确定 | ✅ 输入 → 输出稳定 |
| 可复用 | ✅ 可被多轮调用 |
| 不做隐藏魔法 | ✅ 行为可预测 |
| 易测 | ✅ Handler 可单测 |

### 举个直观对比🌰

**utils 写法**

```ts
function replaceAllStrings(
  files,
  search,
  replace
) {}
```

**Skill 思维**

```ts
apply_global_replace(
  search,
  replace,
  expectedMatches
)
```

👉 在“做什么”层面是**同一类东西**。

---

## 二、关键差异（也是最容易踩坑的点）

> **Skill 永远是写给「模型」看的，而不是写给人直接调用的**

### 1️⃣ 调用者不同（根本差异）

| utils | Skill |
|-----|------|
| 开发者 | LLM（不可靠调用者） |
| 会看源码 | 不会 |
| 会按约定用 | ❌ 会滥用 |
| 理解上下文 | 部分理解 |

➡️ **所以：Skill 防御性必须极强**

---

### 2️⃣ Schema ≈ 函数签名，但更严苛

**utils：**

```ts
replaceAllStrings(files, foo, bar)
```

**Skill：**

```json
{
  "search": "foo",
  "replace": "bar",
  "expectedMatches": 128
}
```

📌 Skill 的参数 **不仅是“能跑”**，  
而是 **“约束模型行为”**。

---

### 3️⃣ Skill 描述 ≈ 文档 + usage guideline + safety note

utils 的注释：

```ts
// replace all strings in files
```

Skill 的 description（必须更啰嗦）：

> Use this ONLY after previewing all replacements and receiving explicit user confirmation.

📌 **description 是 prompt engineering，不只是注释**

---

## 三、一个非常重要的认知升级

> **Skill ≈ utils ×（权限系统 + 安全设计 + 行为引导）**

所以你可以把 Skill 想成：

```text
utils function
+ public API
+ 强类型参数
+ 使用文档（给模型）
+ 权限与风险边界
```

---

## 四、单一职责在 Skill 中 = 更严格 ✅

实际上：

> **Skill 比 utils 更需要“单一职责”**

### 为什么？

utils 是给人用的，人能判断流程  
Skill 是给模型用的，模型只靠描述

所以：

❌ 一个 Skill 做：
- 搜索
- diff
- 替换
- commit

✅ 正确 Skill：
- preview_global_replace
- apply_global_replace
- show_diff
- git_commit

这就像你**不会在 utils 里写一个 `doEverything()`** 一样。

---

## 五、一个非常好的映射心智模型（推荐你记住）

> ```
> Skill ≈ Public, permissioned, AI-facing utils
> ```

而：

> ```
> Tool / Handler ≈ utils 的实现
> Schema ≈ 稳定函数签名
> ```

---

## 六、反过来帮你验证理解（自检用 ✅）

你可以问自己 3 个问题：

1. **这个 Skill 如果只能做一件事，它是什么？**
2. **如果模型误用，它最坏会造成什么后果？**
3. **我是否已经把“防误用”的逻辑放进 Schema 里，而不是寄希望于模型聪明？**

如果三个都能清楚回答——  
👉 **这个 Skill 就已经是合格设计了**

---

## 七、总结一句「工程级结论」

> ✅ **把 Skill 当成 utils 是对的**  
> ✅ **但要当成“暴露给不可靠调用者的 utils”**  
> ✅ **单一职责比 utils 更重要，而不是更宽松**

---

如果你愿意，下一步我可以帮你做一件**非常工程化、很爽的事**：

- ✅ **把你现有某个 utils 重构成 Skill 看看**
- ✅ **设计一套“Skill 版 Clean Architecture 分层”**
- ✅ **从 utils → skill → agent workflow 的映射图**


👉 **“从 utils → skill → agent workflow 的映射图”**

太好了，这正是**从“写函数”到“设计 AI 系统”的关键一跃**。  
我直接给你一张**工程级的心智映射图**，用你最熟的 **utils → skill → agent workflow** 来贯穿。

---

## 一、整体总览（先看全景）

```
┌──────────────────────────────────────────────┐
│                  Agent Workflow               │
│     （策略、规划、确认、回滚、状态管理）       │
└──────────────▲───────────────────────────────┘
               │ orchestration
┌──────────────┴───────────────────────────────┐
│                    Skills                     │
│     （原子能力 + 权限边界 + 可被模型调用）      │
└──────────────▲───────────────────────────────┘
               │ wrapping
┌──────────────┴───────────────────────────────┐
│                     Utils                     │
│        （纯函数 / 可预测 / 工程内部实现）        │
└──────────────────────────────────────────────┘
```

一句话版本：

> **utils 是螺丝刀，skill 是上锁的电动工具，agent workflow 是施工方案。**

---

## 二、第一层：Utils（你已经非常熟）

### ✅ 本质

> **最小、最纯、给“人类工程师”服务的能力单元**

### 特征

- 无权限概念
- 无上下文意识
- 不考虑“被误用”
- 假设调用者理智

### 示例

```ts
// utils/string.ts
export function replaceAll(
  content: string,
  search: string,
  replace: string
): string {
  return content.split(search).join(replace)
}
```

```ts
// utils/fs.ts
export async function findMatches(
  pattern: string,
  files: string[]
) {}
```

📌 **utils 永远不和“AI”打交道**

---

## 三、第二层：Skill（分水岭）

### ✅ 本质

> **对 utils 的“AI 安全封装”**

你可以把 Skill 看成：

```
Skill = utils + 约束 + 文档 + 权限 + 防误用策略
```

---

### Skill 内部结构图

```
Skill
│
├─ Schema（函数签名 × 行为约束）
│
├─ Description（给模型看的 usage 文档）
│
├─ Permission / Scope
│
└─ Handler
    └─ 调用 utils
```

---

### 示例：从 utils 到 skill

#### utils

```ts
replaceAll(content, "foo", "bar")
```

#### skill

```ts
apply_global_replace(
  search="foo",
  replace="bar",
  expectedMatches=128
)
```

⚠️ Skill **不能信任模型会“先想清楚”**  
✅ Skill **必须通过参数逼模型想清楚**

---

## 四、第三层：Agent Workflow（灵魂所在）

### ✅ 本质

> **跨 Skill 的“决策流 + 状态机”**

Agent Workflow 不是一个函数，而是：

- 有步骤
- 有条件
- 有用户确认
- 有错误处理
- 有回滚意识

---

### Workflow 结构图

```
Agent Workflow
│
├─ Step 1: 理解用户意图
│
├─ Step 2: 选择 Skill（只读 or 写）
│
├─ Step 3: Preconditions 检查
│
├─ Step 4: 执行 Skill
│
├─ Step 5: 验证结果
│
├─ Step 6: 用户确认 / 下一步
│
└─ Step 7: Rollback / Commit
```

---

## 五、一条完整链路示例（极其重要）

### 用户：

> “把所有 foo 替换成 bar 并提交”

---

### 🧠 Agent Workflow（逻辑）

```
Intent: global replace + write + commit

if high-risk:
  require preview
```

---

### 🔧 实际调用序列

```
1️⃣ preview_global_replace
   → 得到 128 matches

2️⃣ ask user:
   “将替换 128 处，是否继续？”

3️⃣ user confirms

4️⃣ apply_global_replace
   (expectedMatches=128)

5️⃣ show_diff

6️⃣ git_commit
```

---

### 对应层级映射

```
utils:
  ├─ findMatches
  ├─ replaceAllInFile
  └─ generateDiff

skills:
  ├─ preview_global_replace
  ├─ apply_global_replace
  ├─ show_diff
  └─ git_commit

agent workflow:
  └─ safe_global_replace_flow
```

---

## 六、一个非常好用的 mental model（强烈推荐）

> ✅ **utils：How**
> ✅ **skill：What（+ Safety）**
> ✅ **agent workflow：When / Why / Order**

---

## 七、职责边界速查表（建议收藏）

| 层级 | 决定什么 |
|----|--------|
| utils | 具体怎么做 |
| skill | 能不能被模型做 / 怎么安全地做 |
| agent workflow | 什么时候做 / 做哪一步 |

---

## 八、一个“反面案例”（帮助你自检）

❌ 错误设计：

```ts
skill.doEverything()
```

- 内部调用 n 个 utils
- 自己决定流程
- 自己决定是否 commit

✅ 正确设计：

```
utils: 极小
skills: 原子
workflow: 组合 + 决策
```

---

## 九、终极总结（工程真理级）

> **Utils 是代码复用单位**  
> **Skill 是能力暴露单位**  
> **Agent Workflow 是智能体现单位**

当你发现：
- utils 越来越短
- skills 越来越“啰嗦”
- workflow 越来越清晰

👉 说明你已经在**正确地为 AI 设计系统**了。

---

下一步如果你愿意，我可以继续：

- ✅ 把这张图升级成 **“AI 版 Clean Architecture”**
- ✅ 给你一个 **真实项目目录结构示例**
- ✅ 帮你用这个映射拆解一个 **你正在做的 Agent**

你直接选一句就行 👇  
**“我要目录结构” / “我要 Clean Architecture 版” / “拆解一个真实 Agent”**