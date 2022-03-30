export interface HashGenerator {
  generate (data: string): Promise<string>
}

export interface HashComparator {
  compare (data: string, hash: string): Promise<boolean>
}
