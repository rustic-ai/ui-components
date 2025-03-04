import '../../../index.css'
import '../multipart/multipart.css'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import FilePreview from '../../filePreview/filePreview'
import Icon from '../../icon'
import Text from '../../text'
import type { ChatCompletionProps, Content } from '../../types'

function getFileName(fileUrl: string): string {
  const url = new URL(fileUrl)
  const pathname = url.pathname
  const filename = pathname.split('/').pop()
  return filename as string
}

/**
 * The `ChatCompletion` component provides a flexible message interface
 * that supports both textual content and file attachments within a single message.
 * Its data structure closely mirrors OpenAI's [ChatCompletionRequest](https://platform.openai.com/docs/api-reference/chat),
 * eliminating the need for data conversion to the Chat Completion format.
 */

export default function ChatCompletion(props: ChatCompletionProps) {
  function renderContentArray(contentArray: Content[], index: number) {
    const files: Array<JSX.Element> = []
    let textContent: string = ''
    contentArray.map((cnt) => {
      // To-do: handle other types e.g. input_audio
      if (cnt.type === 'text') {
        textContent += cnt.text
      } else if (cnt.type.endsWith('_url')) {
        // @ts-expect-error field name is dynamic
        const fileUrl: string = cnt[cnt.type].url

        const file = {
          url: fileUrl,
          // @ts-expect-error field name is dynamic
          name: cnt[cnt.type].name || getFileName(fileUrl),
        }

        const preview = (
          <FilePreview file={file} showFullName={props.showFullName}>
            {file.url && (
              <Tooltip title="Download" className="rustic-shift-to-right-by-8">
                <IconButton
                  component="a"
                  href={file.url}
                  download={file.name}
                  data-cy="download-button"
                >
                  <Icon name="download" />
                </IconButton>
              </Tooltip>
            )}
          </FilePreview>
        )
        files.push(preview)
      }
    })
    return (
      <React.Fragment key={index}>
        {textContent.length > 0 && <Text text={textContent} />}
        {files.length > 0 && <Box className="rustic-files">{files}</Box>}
      </React.Fragment>
    )
  }

  return (
    <Box className="rustic-multipart">
      {props.messages.map((msg, index) => {
        if (typeof msg.content === 'string') {
          return <Text text={msg.content} key={index} />
        } else {
          return renderContentArray(msg.content, index)
        }
      })}
    </Box>
  )
}
