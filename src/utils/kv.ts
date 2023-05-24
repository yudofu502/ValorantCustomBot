import KeyvFile, { makeField } from 'keyv-file'

class Members extends KeyvFile {
  constructor() {
    super({
      filename: 'members.keyv',
    })
  }
}

class Guilds extends KeyvFile {
  constructor() {
    super({
      filename: 'guilds.keyv',
    })
  }
}

export const members = new Members()
export const guilds = new Guilds()
