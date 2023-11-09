//@ts-nocheck
import React, { useState } from 'react'

const TextArea = ({ onClickSave, parent }) => {

  const [content, setContent] = useState("")

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={() => {
        onClickSave(content, parent);
        setContent("")
      }}>comment</button>
    </div>
  )
}

export default TextArea