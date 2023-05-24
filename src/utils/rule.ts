import KeyvFile from 'keyv-file'
import { RULES, Rule } from '../constants'

function getRule(userId: string): Rule | undefined {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  const ruleId = members.get(`${userId}.rule`)
  const rule = ruleId !== null ? RULES.find((rule) => rule.id === ruleId) : undefined
  return rule
}

function setRule(userId: string, ruleId?: String): void {
  const members = new KeyvFile({
    filename: 'members.keyv',
  })
  members.set(`${userId}.rule`, ruleId)
}

export { getRule, setRule }
