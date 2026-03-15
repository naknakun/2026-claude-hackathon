-- Posts 테이블
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text not null check (category in ('자유', '건의', '칭찬', '고민')),
  tags text[] default '{}',
  created_at timestamptz default now() not null
);

-- 태그 검색 인덱스
create index posts_tags_gin on posts using gin(tags);

-- Comments 테이블
create table comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- Likes 테이블
create table likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(post_id, user_id)  -- 1인 1회 제한
);

-- RLS 활성화
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- Posts RLS 정책
create policy "누구나 게시글 조회 가능" on posts for select using (true);
create policy "로그인 유저만 게시글 작성 가능" on posts for insert with check (auth.uid() = user_id);
create policy "본인 게시글만 삭제 가능" on posts for delete using (auth.uid() = user_id);

-- Comments RLS 정책
create policy "누구나 댓글 조회 가능" on comments for select using (true);
create policy "로그인 유저만 댓글 작성 가능" on comments for insert with check (auth.uid() = user_id);
create policy "본인 댓글만 삭제 가능" on comments for delete using (auth.uid() = user_id);

-- Likes RLS 정책
create policy "누구나 좋아요 조회 가능" on likes for select using (true);
create policy "로그인 유저만 좋아요 가능" on likes for insert with check (auth.uid() = user_id);
create policy "본인 좋아요만 취소 가능" on likes for delete using (auth.uid() = user_id);
