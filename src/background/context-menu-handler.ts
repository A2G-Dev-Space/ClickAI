// Context Menu Handler for Click AI Extension

import { llmClient } from './llm-client'
import { ChatMessage } from '@/shared/types'
import { generateUUID } from '@/shared/utils'
import { diff_match_patch } from 'diff-match-patch'

export interface ContextMenuResult {
  original: string
  result: string
  diffs: any[]
  type: 'grammar' | 'translate' | 'refine'
}

/**
 * Correct grammar in selected text
 */
export async function correctGrammar(text: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      id: generateUUID(),
      role: 'system',
      content:
        '당신은 문법 교정 전문가입니다. 사용자가 제공한 텍스트의 문법과 맞춤법을 교정하세요. 교정된 텍스트만 출력하고, 설명은 추가하지 마세요.',
      timestamp: Date.now(),
    },
    {
      id: generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    },
  ]

  let result = ''
  for await (const chunk of llmClient.streamChat(messages)) {
    result += chunk
  }

  return result.trim()
}

/**
 * Translate selected text
 */
export async function translateText(text: string): Promise<string> {
  // Detect language and translate
  const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
  const targetLang = isKorean ? '영어' : '한국어'

  const messages: ChatMessage[] = [
    {
      id: generateUUID(),
      role: 'system',
      content: `당신은 전문 번역가입니다. 사용자가 제공한 텍스트를 ${targetLang}로 번역하세요. 번역된 텍스트만 출력하고, 설명은 추가하지 마세요.`,
      timestamp: Date.now(),
    },
    {
      id: generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    },
  ]

  let result = ''
  for await (const chunk of llmClient.streamChat(messages)) {
    result += chunk
  }

  return result.trim()
}

/**
 * Refine expression of selected text
 */
export async function refineExpression(text: string): Promise<string> {
  const messages: ChatMessage[] = [
    {
      id: generateUUID(),
      role: 'system',
      content:
        '당신은 글쓰기 전문가입니다. 사용자가 제공한 텍스트의 표현을 더 자연스럽고 세련되게 다듬어주세요. 의미는 유지하면서 표현만 개선하세요. 개선된 텍스트만 출력하고, 설명은 추가하지 마세요.',
      timestamp: Date.now(),
    },
    {
      id: generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    },
  ]

  let result = ''
  for await (const chunk of llmClient.streamChat(messages)) {
    result += chunk
  }

  return result.trim()
}

/**
 * Compute diff between original and result
 */
export function computeDiff(original: string, result: string): any[] {
  const dmp = new diff_match_patch()
  const diffs = dmp.diff_main(original, result)
  dmp.diff_cleanupSemantic(diffs)
  return diffs
}

/**
 * Handle context menu click
 */
export async function handleContextMenuClick(
  menuItemId: string,
  selectedText: string,
  tabId: number
): Promise<void> {
  let type: 'grammar' | 'translate' | 'refine'
  let result: string

  try {
    // Determine action type and execute
    if (menuItemId === 'click-ai-grammar') {
      type = 'grammar'
      result = await correctGrammar(selectedText)
    } else if (menuItemId === 'click-ai-translate') {
      type = 'translate'
      result = await translateText(selectedText)
    } else if (menuItemId === 'click-ai-refine') {
      type = 'refine'
      result = await refineExpression(selectedText)
    } else {
      console.warn('Unknown menu item:', menuItemId)
      return
    }

    // Compute diff
    const diffs = computeDiff(selectedText, result)

    // Send result to content script
    const contextResult: ContextMenuResult = {
      original: selectedText,
      result,
      diffs,
      type,
    }

    chrome.tabs.sendMessage(tabId, {
      type: 'SHOW_CONTEXT_RESULT',
      payload: contextResult,
      timestamp: Date.now(),
    })

    console.log(`Context menu action completed: ${type}`)
  } catch (error) {
    console.error('Context menu action error:', error)

    // Send error to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'SHOW_CONTEXT_ERROR',
      payload: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      timestamp: Date.now(),
    })
  }
}
