import './codeSnippet.css'

import { languages } from '@codemirror/language-data'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { minimalSetup } from 'codemirror'
import React, { useEffect } from 'react'
import { v4 as getUUID } from 'uuid'

export interface CodeSnippetProps {
  /** Code that will be displayed. */
  code: string
  /** Language type needs to be provided so that the right language extension can be used to format code. Please refer to the [supported languages list](https://codemirror.net/5/mode/). */
  language: string
}

export default function CodeSnippet(props: CodeSnippetProps) {
  //codeSnippetId is used to identify individual code snippet.
  const codeSnippetId = getUUID()

  useEffect(() => {
    const languageObject = languages.find(
      (language) => language.name.toLowerCase() === props.language.toLowerCase()
    )

    const editorOptions = {
      doc: props.code,
      extensions: [minimalSetup, EditorState.readOnly.of(true)],
      parent: document.getElementById(codeSnippetId) as HTMLElement,
    }

    if (languageObject) {
      languageObject.load().then((module) => {
        editorOptions.extensions.push(module.extension)
        new EditorView(editorOptions)
      })
    } else {
      new EditorView(editorOptions)
    }
  }, [])

  return (
    <Box
      sx={{ backgroundColor: 'background.default' }}
      className="rustic-code-snippet"
    >
      <div aria-label="code snippet" id={codeSnippetId} data-cy="code-block">
        <Typography
          variant="body2"
          aria-label="language type"
          data-cy="language-type"
        >
          {props.language}
        </Typography>
      </div>
    </Box>
  )
}
