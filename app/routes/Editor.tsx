import { EditorState } from "prosemirror-state"
import { Schema } from "prosemirror-model"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { history, undo, redo } from "prosemirror-history"
import { nodes } from "prosemirror-schema-basic"
import { ProseMirror } from "@nytimes/react-prosemirror"
import { useState } from "react"
import { db } from "~/lib/hooks"
import { id } from "@instantdb/react"

/**
 * figure out how to render components as nodeviews without breaking everything
 * render all items from instantdb inside prosemirror to support editing, cursoring between
 * ai crap
 */

const todoSchema = new Schema({
  nodes: {
    ...nodes,
    doc: {
      content: "listItem"
    },
    listItem: {
      content: "text*",
      attrs: { done: { default: false } },
      toDOM: (node) => [
        "li",
        {
          "data-type": "todo-item",
          "data-done": node.attrs.done.toString(),
          style: "display: flex;"
        },
        [
          "input",
          {
            type: "checkbox",
            "data-done": node.attrs.done.toString() ?? "false"
          }
        ],
        ["span", { style: "padding-inline: 8px" }, 0]
      ],
      parseDOM: [
        {
          tag: 'li[data-type="todo-item"]',
          getAttrs: (dom) => ({
            done: dom.getAttribute("data-done") === "true"
          })
        }
      ]
    }
  }
})

const todoPlugins = [
  history(),
  keymap({
    "Mod-z": undo,
    "Mod-y": redo,
    Enter: (state, dispatch) => {
      if (!state.doc.firstChild) return true
      let name = state.doc.content.child(0).content.firstChild?.text ?? ""
      db.transact(db.tx.item[id()].update({ name, completed: false }))
      if (dispatch) {
        dispatch(state.tr.delete(0, state.doc.firstChild.nodeSize))
      }
      return true
    }
  }),
  keymap(baseKeymap)
]

const defaultState = EditorState.create({
  schema: todoSchema,
  plugins: todoPlugins,
  doc: todoSchema.node("doc", null, [
    todoSchema.node("listItem", { done: false })
  ])
})

export function Editor() {
  let [mount, setMount] = useState<HTMLElement | null>(null)

  return (
    <div className="pt-2">
      <ProseMirror mount={mount} defaultState={defaultState}>
        <div
          className="outline-none list-none border-b pb-2 border-sky-300"
          ref={setMount}
        />
      </ProseMirror>
    </div>
  )
}
