import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import FilePreview from '../filePreview/filePreview'
import Icon from '../icon'
import Sound from '../media/audio/sound'
import Text from '../text'
import type { ChatCompletionProps, Content } from '../types'

function getFileName(fileUrl: string): string {
  const url = new URL(fileUrl)
  const pathname = url.pathname
  const filename = pathname.split('/').pop()
  return filename as string
}

export default function ChatCompletion(props: ChatCompletionProps) {
  function renderContentArray(contentArray: Content[]) {
    const files: Array<JSX.Element> = []
    let textContent: string = ''
    const audioContent: Array<JSX.Element> = []
    contentArray.map((cnt) => {
      if (cnt.type === 'text') {
        textContent += cnt.text
      } else if (cnt.type.endsWith('_url')) {
        // @ts-expect-error field name is dynamic
        const fileUrl: string = cnt[cnt.type].url
        const file = { url: fileUrl, name: getFileName(fileUrl) }
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
      } else if (cnt.type === 'input_audio') {
        const soundSrc = `data:audio/${cnt.input_audio.format};base64,${cnt.input_audio.data}`
        audioContent.push(<Sound src={soundSrc} />)
      }
    })
    return (
      <>
        {textContent.length > 0 && <Text text={textContent} />}
        {audioContent.length > 0 && <Box>{audioContent}</Box>}
        {audioContent.length > 0 ||
          (files.length > 0 && <Box className="rustic-files">{files}</Box>)}
      </>
    )
  }

  return (
    <Box className="rustic-multipart">
      {props.messages.map((msg) => {
        if (typeof msg.content === 'string') {
          return <Text text={msg.content} />
        } else {
          return renderContentArray(msg.content)
        }
      })}
    </Box>
  )
}
