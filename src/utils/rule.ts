import KeyvFile from 'keyv-file'
import { RULES, Rule } from '../constants'
import { members } from './kv'

function getRule(userId: string): Rule | undefined {
  const ruleId = members.get(`${userId}.rule`)
  const rule = ruleId !== null ? RULES.find((rule) => rule.id === ruleId) : undefined
  return rule
}

function setRule(userId: string, ruleId?: String): void {
  members.set(`${userId}.rule`, ruleId)
}

export { getRule, setRule }
