import { Organization } from '@polar-sh/sdk'

import { shouldBeOnboarded } from '@/hooks/onboarding'
import { isFeatureEnabled } from '@/utils/feature-flags'
import { ArrowUpRightIcon } from '@heroicons/react/20/solid'
import {
  AllInclusiveOutlined,
  AttachMoneyOutlined,
  Bolt,
  BoltOutlined,
  CropFreeOutlined,
  DiamondOutlined,
  Face,
  FavoriteBorderOutlined,
  HowToVoteOutlined,
  SpaceDashboardOutlined,
  StickyNote2Outlined,
  TuneOutlined,
  VolunteerActivismOutlined,
  Webhook,
  WifiTetheringOutlined,
} from '@mui/icons-material'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export type SubRoute = {
  readonly title: string
  readonly link: string
  readonly icon?: React.ReactNode
}

export type Route = {
  readonly id: string
  readonly title: string
  readonly icon?: React.ReactElement
  readonly postIcon?: React.ReactElement
  readonly link: string
  readonly if: boolean | undefined
  readonly subs?: SubRoute[]
  readonly selectedExactMatchOnly?: boolean
  readonly selectedMatchFallback?: boolean
  readonly checkIsActive?: (currentPath: string) => boolean
}

export type SubRouteWithActive = SubRoute & { readonly isActive: boolean }

export type RouteWithActive = Route & {
  readonly isActive: boolean
  readonly subs?: SubRouteWithActive[]
}

const applySubRouteIsActive = (
  path: string,
): ((r: SubRoute) => SubRouteWithActive) => {
  return (r: SubRoute): SubRouteWithActive => {
    const isActive = r.link === path
    return {
      ...r,
      isActive,
    }
  }
}

const applyIsActive = (path: string): ((r: Route) => RouteWithActive) => {
  return (r: Route): RouteWithActive => {
    let isActive = false

    if (r.checkIsActive !== undefined) {
      isActive = r.checkIsActive(path)
    } else {
      // Fallback
      isActive = Boolean(path && path.startsWith(r.link))
    }

    const subs = r.subs ? r.subs.map(applySubRouteIsActive(path)) : undefined

    return {
      ...r,
      isActive,
      subs,
    }
  }
}

export const useMaintainerRoutes = (
  org?: Organization,
  allowAll?: boolean,
): RouteWithActive[] => {
  const path = usePathname()

  const r = useMemo(() => {
    if (!org) {
      return []
    }

    return maintainerRoutesList(org)
      .filter((o) => allowAll || o.if)
      .map(applyIsActive(path))
  }, [org, path, allowAll])

  return r
}

export const useMaintainerDisabledRoutes = (
  org?: Organization,
): RouteWithActive[] => {
  const path = usePathname()

  const r = useMemo(() => {
    if (!org) {
      return []
    }

    return maintainerRoutesList(org)
      .filter((o) => {
        switch (o.id) {
          case 'org-issues':
          case 'org-subscriptions':
          case 'newsletter':
          case 'donations':
            return true
          default:
            return false
        }
      })
      .filter((o) => !o.if)
      .map(applyIsActive(path))
  }, [org, path])

  return r
}

export const useDashboardRoutes = (
  org: Organization | undefined,
  isPersonal: boolean,
  isOrgAdmin: boolean,
): RouteWithActive[] => {
  const path = usePathname()

  if (!org || shouldBeOnboarded(org)) {
    return []
  }

  return dashboardRoutesList(org, isPersonal, isOrgAdmin)
    .filter((o) => o.if)
    .map(applyIsActive(path))
}

export const useBackerRoutes = (): RouteWithActive[] => {
  const path = usePathname()
  return backerRoutesList()
    .filter((o) => o.if)
    .map(applyIsActive(path))
}

export const usePersonalFinanceSubRoutes = (): SubRouteWithActive[] => {
  const path = usePathname()
  return personalFinanceSubRoutesList().map(applySubRouteIsActive(path))
}

// internals below

const maintainerRoutesList = (org: Organization): Route[] => [
  {
    id: 'overview',
    title: 'Overview',
    icon: <SpaceDashboardOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/overview`,
    if: true,
  },
  {
    id: 'newsletter',
    title: 'Newsletter',
    icon: <StickyNote2Outlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/posts`,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(`/maintainer/${org.name}/posts`)
    },
    if: org.feature_settings?.articles_enabled,
  },
  {
    id: 'org-subscriptions',
    title: 'Subscriptions',
    icon: <Bolt className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/subscriptions/overview`,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(`/maintainer/${org.name}/subscriptions`)
    },
    if: org.feature_settings?.subscriptions_enabled,
    subs: [
      {
        title: 'Overview',
        link: `/maintainer/${org.name}/subscriptions/overview`,
      },
      {
        title: 'Tiers',
        link: `/maintainer/${org.name}/subscriptions/tiers`,
      },
      {
        title: 'Benefits',
        link: `/maintainer/${org.name}/subscriptions/benefits`,
      },
      {
        title: 'Subscribers',
        link: `/maintainer/${org.name}/subscriptions/subscribers`,
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    icon: <DiamondOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/products/overview`,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(`/maintainer/${org.name}/products`)
    },
    get if() {
      return isFeatureEnabled('products')
    },
  },
  {
    id: 'donations',
    title: 'Donations',
    icon: <VolunteerActivismOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/donations/overview`,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(`/maintainer/${org.name}/donations`)
    },
    if: org.donations_enabled,
  },
  {
    id: 'org-issues',
    title: 'Issues',
    icon: <HowToVoteOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/issues/overview`,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(`/maintainer/${org.name}/issues`)
    },
    if: org.feature_settings?.issue_funding_enabled,
    subs: [
      {
        title: 'Overview',
        link: `/maintainer/${org.name}/issues/overview`,
        icon: <HowToVoteOutlined fontSize="inherit" />,
      },
      {
        title: 'Badge',
        link: `/maintainer/${org.name}/issues/badge`,
        icon: <CropFreeOutlined fontSize="inherit" />,
      },
    ],
  },
  {
    id: 'funding',
    title: 'Funding',
    link: `/maintainer/${org.name}/funding`,
    icon: <FavoriteBorderOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    if: true,
    subs: undefined,
  },
  {
    id: 'members',
    title: 'Members',
    link: `/maintainer/${org.name}/members`,
    icon: <Face fontSize="inherit" />,
    postIcon: undefined,
    if: org.is_teams_enabled,
    subs: undefined,
  },
  {
    id: 'promote',
    title: 'Promote',
    icon: <WifiTetheringOutlined fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/promote`,
    if: true,
    subs: undefined,
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    icon: <Webhook fontSize="inherit" />,
    postIcon: undefined,
    link: `/maintainer/${org.name}/webhooks`,
    if: false,
    checkIsActive: (currentRoute: string): boolean => {
      return currentRoute.startsWith(
        `/maintainer/${org.name}/settings/webhooks`,
      )
    },
  },
]

const backerRoutesList = (): Route[] => [
  {
    id: 'posts',
    title: 'Feed',
    link: `/feed`,
    icon: <AllInclusiveOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    if: true,
    subs: undefined,
  },
  {
    id: 'subscriptions',
    title: 'My Subscriptions',
    link: `/subscriptions`,
    icon: <BoltOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    if: true,
    subs: undefined,
  },
  {
    id: 'funding',
    title: 'Funding',
    link: `/funding`,
    icon: <FavoriteBorderOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    if: true,
    subs: undefined,
  },
  {
    id: 'purchases',
    title: 'Purchases',
    link: `/purchases`,
    icon: <DiamondOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: undefined,
    get if() {
      return isFeatureEnabled('products')
    },
    subs: undefined,
  },
]

const personalFinanceSubRoutesList = (): SubRoute[] => [
  {
    title: 'Incoming',
    link: `/finance/incoming`,
  },
  {
    title: 'Outgoing',
    link: `/finance/outgoing`,
  },
  {
    title: 'Issue Rewards',
    link: `/finance/rewards`,
  },
  {
    title: 'Issue Funding',
    link: `/finance/issue-funding`,
  },
  {
    title: 'Payout Account',
    link: `/finance/account`,
  },
]

const orgFinanceSubRoutesList = (org: Organization): SubRoute[] => [
  {
    title: 'Incoming',
    link: `/maintainer/${org.name}/finance/incoming`,
  },
  {
    title: 'Outgoing',
    link: `/maintainer/${org.name}/finance/outgoing`,
  },
  {
    title: 'Issue Funding',
    link: `/maintainer/${org.name}/finance/issue-funding`,
  },

  {
    title: 'Payout Account',
    link: `/maintainer/${org.name}/finance/account`,
  },
]

const dashboardRoutesList = (
  org: Organization,
  isPersonal: boolean,
  isOrgAdmin: boolean,
): Route[] => [
  {
    id: 'finance',
    title: 'Finance',
    link: isPersonal ? `/finance` : `/maintainer/${org.name}/finance`,
    icon: <AttachMoneyOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: isPersonal ? <ArrowUpRightIcon className="h-5 w-5" /> : undefined,
    if: isOrgAdmin,
    subs: isPersonal
      ? personalFinanceSubRoutesList()
      : orgFinanceSubRoutesList(org),
  },
  {
    id: 'settings',
    title: 'Settings',
    link: isPersonal ? `/settings` : `/maintainer/${org.name}/settings`,
    icon: <TuneOutlined className="h-5 w-5" fontSize="inherit" />,
    postIcon: isPersonal ? <ArrowUpRightIcon className="h-5 w-5" /> : undefined,
    if: isPersonal || isOrgAdmin ? true : false,
    subs: undefined,
  },
]

export const metaRoutes: Route[] = [
  {
    id: 'blog',
    title: 'Blog',
    link: `https://polar.sh/polarsource`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'docs',
    title: 'Docs & Support',
    link: `https://docs.polar.sh`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'github',
    title: 'GitHub',
    link: `https://github.com/polarsource/polar`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'discord',
    title: 'Join our Discord',
    link: `https://discord.gg/STfRufb32V`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
]

export const unauthenticatedRoutes: Route[] = [
  {
    id: 'polar',
    title: 'Polar',
    link: `/`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'blog',
    title: 'Blog',
    link: `https://polar.sh/polarsource`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'faq',
    title: 'FAQ',
    link: `https://docs.polar.sh/faq/`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
  {
    id: 'docs',
    title: 'Docs',
    link: `https://docs.polar.sh`,
    icon: undefined,
    postIcon: <ArrowUpRightIcon className="h-4 w-4" />,
    if: true,
    subs: undefined,
  },
]
