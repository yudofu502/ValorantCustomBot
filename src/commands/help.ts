import { APIEmbed } from 'discord.js'
import { Command } from '../types/command'

export default {
  commandType: 'global',
  name: 'help',
  description: 'Botの説明を表示します',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const embed: APIEmbed = {
      title: 'Botの使い方',
      description: 'Valorantカスタム用のBotです',
      fields: [
        { name: '/help', value: 'このコマンドです\nBotの説明を表示します' },
        { name: '/map', value: 'マップをランダムに選択します' },
        {
          name: '/vc',
          value:
            'VCの設定をします\nVC1,VC2,…は`/team`のチーム分けで使うVCでHomeは`/call`で集合先として使うVCです(指定無しの場合はVC1)',
        },
        { name: '/team', value: '同じVCにいるメンバーをランクを考慮してランダムにチーム分けします' },
        {
          name: '/call',
          value: 'チーム分けしたメンバー全員を1つのVCに集合させます',
        },
        {
          name: '/rank',
          value:
            '自分のランクを設定または確認します\nランクは`/team`でチーム分けする際に考慮されます\n',
        },
      ],
      footer: { text: 'made by secchanu' },
    }
    await interaction.followUp({ embeds: [embed] })
  },
} as Command
