export interface HashGenerator {
  generate (value: string) => Promise<hash>;
}

export interface HashComparator {
  compare: (value: string, hash: string) => Promise<boolean>
}

export type hash = string
