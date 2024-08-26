import { Context } from "hono";
import { Query } from "../types/workertypes";

const IntentRecognition_Prompt: string = `
# Your Role: 你是一个搜索意图识别专家，专注于识别用户自然语言背后的真实搜索意图和搜索需求，并精心完成以下几步工作：

## Your jobs
### job A: 意图识别
深入分析用户的自然语言输入，精确提取其中的主要要素和核心需求，分析用户的当前意图是属于以下哪一类：日常聊天类(分类为1)、非日常聊天类的问题或可能需要近期信息才能准确回答的问题(分类为2).

### job B: 将用户的自然语言分拆成几个角度的搜索内容
如果在job A中识别到用户的搜索意图是第二类,即非日常聊天类的问题或可能需要近期信息才能准确回答的问题，则你需要识别其中的主要要素及领会用户的搜索背后的需求，并且据此将用户的问题拆分成三个不同角度的搜索问题，以便后续从搜索引擎中得到多方面的翔实、深入的内容。拆分的问题所用的语种需要和用户输入的自然语言的语种一致.

### job C:对job A中得出的结果进行置信度评估
对job A中得出的结果,即用户的当前意图是属于哪一类的结论,你需要评估自己判断的置信度,并给出一个从0到1之间的置信度分数, 以便后续程序判断是否采信.

### job D:输出JSON格式结果
将以上全部工作成功汇总到一个json格式的字符串中输出.

## 输出的json schema:
{
  "intent_category": "1" | "2",
  "sub_questions": ["question1", "question2", "question3"],
  "confidence_score": 0.0 to 1.0
}

## 用户输入的自然语言搜索需求如下：\n
`;

const QuickRAG_prompt: string = ``;

class ContextManager {
  private readonly maxTokens: number = 100000;

  getInitContext(): string {
    const intentRecognitionContext = IntentRecognition_Prompt;
    return intentRecognitionContext;
  }

  async getQueryContext(query: Query, c: Context): Promise<string> {
    const queryContext = query.content;
    return queryContext;
  }

  async getIntentRecognitionContext(query: Query, c: Context): Promise<string> {
    const queryContext = await this.getQueryContext(query, c);
    const intentRecognitionContext = this.getInitContext() + queryContext;
    return intentRecognitionContext;
  }

}

export const contextManager = new ContextManager();


// // Models for D1
// export type User = {
//   id: string;
//   email?: string;
//   name?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   queries?: string; // query ids, convert the array to string before saving and parse it when reading
// };

// export type Query = {
//   id: string;
//   userId?: string;
//   content: string;
//   intentCategory:
//     | "DIRECT_LLM_ANSWER"
//     | "CACHED_PROFILE"
//     | "QUICK_RAG"
//     | "FULL_RAG";
//   createdAt: Date;
//   searchResults?: string; // search result ids, convert the array to string before saving and parse it when reading
//   ragResultId?: string;
//   deepRAGProfileId?: string;
// };

// export type SearchResult = {
//   id: string;
//   queryId: string;
//   type: "text" | "image" | "video";
//   content: string; // text or img/video url
//   metadata?: string; // metadata for the search result. convert the json to string before saving and parse it when reading
//   createdAt: Date;
// };

// export type RAGResult = {
//   id: string;
//   queryId: string;
//   content: string;
//   isQuickRAG: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type DeepRAGProfile = {
//   id: string;
//   queryId: string;
//   content: string;
//   reflection: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// };

// // RAGProcess Model (for KV)

// export type RAGProcess = {
//   id: string;
//   queryId: string;
//   status: "pending" | "completed" | "failed" | "quick RAG" | "full RAG" | "intent recognition";
//   createdAt: Date;
//   updatedAt: Date;
// };

// // Env for backend-worker

// export interface Bindings {
//   // cloudflare bindings
//   DB: D1Database;
//   KV: KVNamespace;

//   // Environment variables
//   OPENROUTER_MODEL: string;
//   OPENROUTER_API_KEY: string;
// }
