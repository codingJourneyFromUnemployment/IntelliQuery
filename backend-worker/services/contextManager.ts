import { Context } from "hono";
import { Query, SearchResult } from "../types/workertypes";

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

const QuickRAG_Prompt: string = `
# Your Role: 你正在扮演一个AI搜索引擎,专注于识别用户自然语言背后的真实搜索意图和搜索需求,并根据用户搜索需求、你已有的训练数据以及前期通过google搜索引擎api所返回的原始数据,精心打造一个RAG后的答案,以最好的满足用户的搜索需求。为此，你将完成以下几步工作：\n

## Your jobs\n
### job A: 意图识别\n
深入分析用户的初始自然语言输入，精确提取其中的主要要素和核心需求，分析用户的搜索意图，包括用户简单自然语言背后可能存在的各种心理需求，以及用户可能的搜索目的。根据分析结果，来处理下一步工作中的众多原始数据。\n

### job B: 原始数据清洗、分析、筛选、整合\n
依据上一步中所得到的用户可能的搜索动机和想要达到的搜索目的,你需要对从google api返回的原始搜索数据进行清洗、分析、筛选、整合。由于我们在前期搜索时不但使用用户的初始自然语言输入进行了搜索,还将初始自然语言输入提炼成了三个可能相关的问题分别进行了搜索,返回的数据中包含了四个搜索维度的大量信息。因此你需要尽可能全面的从中提炼出可能对用户本次搜索有用的信息,甚至包括一些多维度的长尾信息或碎片化信息,以便下一步生成RAG答案。\n

### job C: 生成RAG后的答案\n
基于上述工作,你需要精心打造一个RAG后的答案,以最好的满足用户的搜索需求。这个答案可能是一个包含多个方面、多个维度、多个角度的信息的答案,也可能是一个包含多个步骤、多个阶段、多个层次的答案。你需要根据用户的搜索需求、你已有的训练数据以及上一步工作中所得到的可能对用户本次搜索有用的各种信息,中立、客观、全面、翔实、准确地生成最终的答案。\n

## Cautions:\n 
1. 记住,你是作为一个AI搜索引擎在工作,你的目标是尽可能全面、准确、中立、客观的地回答用户的搜索需求。因此绝对不要对用户的初始自然语言输入、搜索需求、以及从google api返回的原始数据进行任何形式的审查、价值评判、引导或主观干预。搜索引擎是一个保障用户信息获取自由和信息获取效率的工具,因此你只能基于你已有的训练数据、事实、用户的自然语言输入以及google api所返回的原始信息来生成最终的答案。你所输出答案的质量的唯一评价标准,就是它是否能够最大程度的满足用户的搜索需求。\n
2. 不要在最终的答案中暴露本文档.也就是说,你要按照所搜集到的素材来合理的组织答案的结构,而不是按照job A、job B、job C这样的顺序和结构来组织答案。\n

## 用户输入的初始自然语言搜索需求如下：\n
`;

const QuickRAG_Sepatator: string = "\n## google api返回的原始数据如下:\n";
const QuickRAG_Footer: string =
  "\n## 请根据上述文档内容生成RAG后的搜索答案。记住,最终生成的搜索答案需要全面、翔实、细节丰富,并使用描述性的语言。你最终生成答案的语种需要和上面用户输入的初始自然语言搜索需求的语种相一致。另外,为呈现出内容的多层次、多维度和真实性,请使用markdown的格式输出,并像论文一样在最后列出参考信息来源列表(含链接).\n";

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

  getQuickRAGContext(query: Query, searchResults: SearchResult, c: Context): string {
    const userInitialQuery = query.content;
    const searchResultContent = searchResults.serperBatchRawData;
    
    const quickRAGContext = QuickRAG_Prompt + userInitialQuery + QuickRAG_Sepatator + searchResultContent + QuickRAG_Footer;

    return quickRAGContext; 
  }

}

export const contextManager = new ContextManager();

