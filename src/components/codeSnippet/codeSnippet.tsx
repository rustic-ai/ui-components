import './codeSnippet.css'

import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { Compartment, EditorState } from '@codemirror/state'
import { EditorView, highlightSpecialChars } from '@codemirror/view'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useRef } from 'react'

import type { CodeData } from '../types'

export default function CodeSnippet(props: CodeData) {
  const codeSnippetContainer = useRef<HTMLDivElement>(null)
  const editorView = useRef<EditorView>()
  const langCompartment = new Compartment()

  const minimalExtensions = [
    EditorState.readOnly.of(true),
    highlightSpecialChars(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    langCompartment.of([]),
  ]

  const languageObject = languages.find(
    (language) => language.name.toLowerCase() === props.language.toLowerCase()
  )

  useEffect(() => {
    if (codeSnippetContainer.current && !editorView.current) {
      const editorContainer = codeSnippetContainer.current as HTMLElement

      const editorState = EditorState.create({
        doc: props.code,
        extensions: minimalExtensions,
      })
      editorView.current = new EditorView({
        state: editorState,
        parent: editorContainer,
      })

      if (languageObject && editorView.current) {
        languageObject.load().then((module) => {
          editorView.current?.dispatch({
            effects: langCompartment.reconfigure(module.extension),
          })
        })
      }
    }
  }, [])

  return (
    <Box
      sx={{ backgroundColor: 'background.default' }}
      className="rustic-code-snippet"
    >
      <div
        aria-label="code snippet"
        ref={codeSnippetContainer}
        data-cy="code-block"
      >
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
