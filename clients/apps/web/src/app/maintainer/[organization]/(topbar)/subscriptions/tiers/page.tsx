import { EnableSubscriptionsView } from '@/components/Subscriptions/EnableSubscriptionsView'
import TiersPage from '@/components/Subscriptions/TiersPage'
import { getServerSideAPI } from '@/utils/api/serverside'
import { Platforms } from '@polar-sh/sdk'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { organization: string }
}): Promise<Metadata> {
  return {
    title: `${params.organization}`, // " | Polar is added by the template"
  }
}

export default async function Page({
  params,
}: {
  params: { organization: string }
}) {
  const api = getServerSideAPI()

  const organization = await api.organizations.lookup({
    organizationName: params.organization,
    platform: Platforms.GITHUB,
  })

  if (!organization.feature_settings?.subscriptions_enabled) {
    return <EnableSubscriptionsView organization={organization} />
  }

  return <TiersPage organization={organization} />
}
