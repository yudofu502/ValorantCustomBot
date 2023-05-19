import { Command } from '../types/command'
import Keyv from 'keyv'
import fetch from 'isomorphic-fetch'
import { ApplicationCommandOptionType } from 'discord.js'

type Agent = {
  id: string
  name: string
  roleName: string
  img: string
}

export default {
  commandType: 'global',
  name: 'agent',
  description: 'ランダムにエージェントを選択します',
  options: [
    {
      name: 'role',
      description: '役割',
      type: ApplicationCommandOptionType.String,
      choices: [
        {
          name: 'デュエリスト',
          value: 'デュエリスト',
        },
        {
          name: 'センチネル',
          value: 'センチネル',
        },
        {
          name: 'コントローラー',
          value: 'コントローラー',
        },
        {
          name: 'イニシエーター',
          value: 'イニシエーター',
        },
      ],
    },
  ],
  async execute(interaction) {
    const agent = await getAgent(interaction.options.getString('role'))
    if (!agent) {
      await interaction.reply('エージェントが見つかりませんでした')
      return
    }

    await interaction.channel?.send({
      embeds: [
        {
          title: agent.name,
          image: {
            url: agent.img,
          },
        },
      ],
    })
    interaction.reply(interaction.user.toString() + ' エージェントを選択しました')
  },
} as Command

const agentsCache = new Keyv({
  namespace: 'agents',
})

const getAgent = async (roleStrict: String | null): Promise<Agent | undefined> => {
  const cached = await agentsCache.get('agents')

  let agentsData: Agent[] = []

  if (!cached) {
    const mapApi = `https://valorant-api.com/v1/agents?language=ja-JP`
    const res = await fetch(mapApi)
    const data = await res.json()
    agentsData = data.data
      .map((agent: any) => {
        return {
          id: agent.uuid,
          roleName: agent.role?.displayName,
          name: agent.displayName,
          img: agent.displayIcon,
        } as Agent
      })
      .filter((agent: Agent) => !roleStrict || agent.roleName === roleStrict)
    agentsCache.set('agents', agentsData, 60 * 60 * 1000) //ソースからの更新頻度
  }
  const agents: Agent[] = cached ?? agentsData ?? []
  const agent = agents[Math.floor(Math.random() * agents.length)]
  return agent
}
