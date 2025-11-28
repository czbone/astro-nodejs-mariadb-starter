import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 初期データの挿入を開始します...')

  // 既存のデータをクリア
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  // ユーザーの作成
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson'
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith'
    }
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Brown'
    }
  })

  console.log('✅ ユーザーを作成しました:', { user1, user2, user3 })

  // 投稿の作成
  const post1 = await prisma.post.create({
    data: {
      title: 'AstroとPrismaの組み合わせについて',
      content:
        'AstroとPrismaを組み合わせることで、パフォーマンスの良いWebアプリケーションを構築できます。Prismaの型安全性とAstroの高速なレンダリングが相乗効果を生み出します。',
      published: true,
      authorId: user1.id
    }
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'TailwindCSS v4の新機能',
      content:
        'TailwindCSS v4では、CSS変数の活用や新しいユーティリティクラスが追加され、より効率的なスタイリングが可能になりました。',
      published: true,
      authorId: user2.id
    }
  })

  const post3 = await prisma.post.create({
    data: {
      title: 'データベース設計のベストプラクティス',
      content:
        'リレーショナルデータベースを設計する際は、正規化とパフォーマンスのバランスを考慮することが重要です。',
      published: false,
      authorId: user3.id
    }
  })

  const post4 = await prisma.post.create({
    data: {
      title: 'TypeScriptとPrismaの型安全性',
      content:
        'Prismaのスキーマから自動生成されるTypeScriptの型定義により、コンパイル時にデータベース操作のエラーを検出できます。',
      published: true,
      authorId: user1.id
    }
  })

  const post5 = await prisma.post.create({
    data: {
      title: 'モダンなWeb開発のワークフロー',
      content: 'Git、Docker、CI/CDを活用したモダンな開発ワークフローについて解説します。',
      published: true,
      authorId: user2.id
    }
  })

  console.log('✅ 投稿を作成しました:', { post1, post2, post3, post4, post5 })

  // 統計情報の表示
  const userCount = await prisma.user.count()
  const postCount = await prisma.post.count()
  const publishedPostCount = await prisma.post.count({
    where: { published: true }
  })

  console.log('\n📊 データベース統計:')
  console.log(`- ユーザー数: ${userCount}`)
  console.log(`- 投稿数: ${postCount}`)
  console.log(`- 公開済み投稿数: ${publishedPostCount}`)

  console.log('\n🎉 初期データの挿入が完了しました！')
}

main()
  .catch((e) => {
    console.error('❌ エラーが発生しました:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
