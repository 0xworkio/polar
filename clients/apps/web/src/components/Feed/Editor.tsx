'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextArea,
} from 'polarkit/components/ui/atoms'
import { ChangeEventHandler, useCallback } from 'react'
// @ts-ignore
import Markdown, { Components } from 'react-markdown'
import { twMerge } from 'tailwind-merge'
import LongformPost from './LongformPost'
import { Post } from './data'

interface EditorProps {
  post?: Post
  value: string
  onChange?: (value: string) => void
}

const Editor = ({ post, value, onChange }: EditorProps) => {
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    async (e) => {
      onChange?.(e.target.value)
    },
    [onChange],
  )

  return (
    <Tabs className="flex h-full flex-col gap-y-6" defaultValue="edit">
      <TabsList className="dark:border-polar-700 dark:border">
        <TabsTrigger value="edit">Markdown</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent className="h-full" value="edit">
        <TextArea
          className="h-full min-h-[600px] rounded-3xl p-6 text-lg"
          resizable={false}
          value={value}
          onChange={handleChange}
        />
      </TabsContent>
      <TabsContent value="preview">
        {post ? (
          <div className="dark:bg-polar-700 flex w-full flex-col items-center rounded-3xl bg-white p-16 shadow-xl">
            <LongformPost post={post} />
          </div>
        ) : (
          <Markdown
            className="prose dark:prose-invert prose-headings:my-2 prose-pre:bg-gray-100 prose-pre:text-black dark:prose-pre:bg-gray-700 dark:prose-pre:text-white prose-code:before:content-[''] prose-code:after:content-[''] prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:font-normal prose-code:p-1 prose-code:rounded relative max-w-none leading-relaxed"
            components={COMPONENTS}
          >
            {value}
          </Markdown>
        )}
      </TabsContent>
    </Tabs>
  )
}

export default Editor

export const COMPONENTS: Components = {
  h1: (props) => (
    <h1
      {...props}
      className={twMerge(
        'dark:text-polar-50 my-10 text-3xl font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className={twMerge(
        'dark:text-polar-50 my-10 text-2xl font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={twMerge(
        'dark:text-polar-50 my-10 text-xl font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className={twMerge(
        'dark:text-polar-50 my-10 text-lg font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  h5: (props) => (
    <h5
      {...props}
      className={twMerge(
        'dark:text-polar-50 text-md my-10 font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  h6: (props) => (
    <h6
      {...props}
      className={twMerge(
        'dark:text-polar-50 my-10 text-sm font-semibold text-gray-950',
        props.className,
      )}
    />
  ),
  p: (props) => (
    <p
      {...props}
      className={twMerge(
        'dark:text-polar-300 my-10 text-lg text-gray-700',
        props.className,
      )}
    />
  ),
  a: (props) => (
    <a
      {...props}
      className={twMerge(
        'my-10 text-lg text-blue-500 hover:underline dark:text-blue-400',
        props.className,
      )}
      rel="noopener noreferrer"
      target="_blank"
    />
  ),
  ul: (props) => (
    <ul
      {...props}
      className={twMerge('my-10 list-disc text-lg', props.className)}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={twMerge('my-10 list-decimal text-lg', props.className)}
    />
  ),
  li: (props) => (
    <li
      {...props}
      className={twMerge(
        'dark:text-polar-300 my-1 text-lg text-gray-700',
        props.className,
      )}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className={twMerge('my-10 text-lg', props.className)}
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className={twMerge(
        'dark:bg-polar-800 my-10 w-full overflow-x-auto rounded-2xl bg-gray-50 p-6 text-lg leading-none',
        props.className,
      )}
    />
  ),
  code: (props) => (
    <code
      {...props}
      className={twMerge(
        'w-full min-w-0 text-sm leading-none',
        props.className,
      )}
    />
  ),
  hr: (props) => (
    <hr {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  table: (props) => (
    <table {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  thead: (props) => (
    <thead {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  tbody: (props) => (
    <tbody {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  tr: (props) => (
    <tr {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  th: (props) => (
    <th {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  td: (props) => (
    <td {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  em: (props) => (
    <em {...props} className={twMerge('italics', props.className)} />
  ),
  img: (props) => (
    <img
      {...props}
      className={twMerge(
        'my-10 w-full rounded-2xl text-lg shadow-xl',
        props.className,
      )}
    />
  ),
  iframe: (props) => (
    <iframe {...props} className={twMerge('my-10 text-lg', props.className)} />
  ),
  span: (props) => (
    <span
      {...props}
      className={twMerge(
        'dark:text-polar-300 my-10 text-lg text-gray-700',
        props.className,
      )}
    />
  ),
  strong: (props) => (
    <strong {...props} className={twMerge('font-semibold', props.className)} />
  ),
}
