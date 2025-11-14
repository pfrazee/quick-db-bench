import { Generated, ColumnType } from 'kysely'

// Common fields for all tables
interface CommonFields {
  _uri: string
  _repo: string
  _rkey: string
  _indexedAt: ColumnType<Date, Date | undefined, Date>
}

export interface ProfilesTable extends CommonFields {
  handle: string
  displayName: string | null
  description: string | null
  createdAt: Date | null
}

export interface FollowsTable extends CommonFields {
  subject: string
  createdAt: Date | null
}

export interface LikesTable extends CommonFields {
  subject: string
  createdAt: Date | null
}

export interface RepostsTable extends CommonFields {
  subject: string
  createdAt: Date | null
}

export interface PostsTable extends CommonFields {
  text: string | null
  replyTo: string | null
  createdAt: Date | null
}

export interface ThreadgatesTable extends CommonFields {
  rules: string | null
  createdAt: Date | null
}

export interface Database {
  profiles: ProfilesTable
  follows: FollowsTable
  likes: LikesTable
  reposts: RepostsTable
  posts: PostsTable
  threadgates: ThreadgatesTable
}
