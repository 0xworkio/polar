import { PolarQueryClientProvider } from '@/app/providers'
import { UserContextProvider } from '@/providers/auth'
import { article } from '@/utils/testdata'
import type { Meta, StoryObj } from '@storybook/react'
import LongformPost from './LongformPost'

const meta: Meta<typeof LongformPost> = {
  title: 'Organisms/LongformPost',
  component: LongformPost,
}

export default meta

type Story = StoryObj<typeof LongformPost>

const articleWithPaywall = {
  ...article,
  body: `Hello. This is a demo article. Here is some paywalled content:
  
<Paywall>Behind paywall</Paywall>
  
Thanks for reading!
  `,
}

export const Default: Story = {
  args: {
    article: articleWithPaywall,
    showPaywalledContent: false,
    isSubscriber: false,
    hasPaidArticlesBenefit: true,
    showShare: false,
    paidArticlesBenefitName: 'ProTier200',
  },
  render: (args) => (
    <UserContextProvider user={{}}>
      <PolarQueryClientProvider>
        <LongformPost {...args} />
      </PolarQueryClientProvider>
    </UserContextProvider>
  ),
}

export const IsFreeSubscriber: Story = {
  ...Default,
  args: {
    ...Default.args,
    isSubscriber: true,
    hasPaidArticlesBenefit: false,
  },
}

export const IsPaidSubscriber: Story = {
  args: {
    ...Default.args,
    isSubscriber: true,
    showPaywalledContent: true,
    hasPaidArticlesBenefit: true,
  },
}
