import PublicLayout from '@/components/Layout/PublicLayout'
import TopbarLayout from '@/components/Layout/TopbarLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TopbarLayout logoPosition="center" isFixed={false} hideProfile={true}>
      <PublicLayout>
        <>{children}</>
      </PublicLayout>
    </TopbarLayout>
  )
}