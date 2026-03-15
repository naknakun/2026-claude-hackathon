export type Category = '자유' | '건의' | '칭찬' | '고민'

export interface Post {
  id: string
  title: string
  content: string
  category: Category
  created_at: string
  comment_count?: number
  like_count?: number
}

export interface Comment {
  id: string
  post_id: string
  content: string
  created_at: string
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}
