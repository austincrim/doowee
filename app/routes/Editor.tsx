import { EditorState } from "prosemirror-state"
import { Node, Schema } from "prosemirror-model"
import { keymap } from "prosemirror-keymap"
import { baseKeymap } from "prosemirror-commands"
import { history, undo, redo } from "prosemirror-history"
import { nodes } from "prosemirror-schema-basic"
import { ProseMirror } from "@nytimes/react-prosemirror"
import { useEffect, useState } from "react"
import { db, useInstant } from "~/lib/hooks"
import { id } from "@instantdb/react"

/**
 * figure out how to render components as nodeviews without breaking everything
 * ai slop
 *  type in "@recipe", scaffold ingredients
 *  running estimate of cost
 *  suggestions "it's been two weeks since you bought milk"
 */

function findNodePosition(doc: Node, targetNode: Node) {
  let result = 0
  doc.descendants((node, pos) => {
    if (node === targetNode) {
      result = pos
      return false // Stop traversal
    }
  })
  return result
}

const todoSchema = new Schema({
  nodes: {
    ...nodes,
    doc: {
      content: "listItem* paragraph?"
    },
    listItem: {
      content: "text*",
      attrs: {
        done: { default: false },
        content: { default: "something" },
        id: { default: 0 }
      },
      toDOM: (node) => [
        "li",
        {
          "data-type": "todo-item",
          "data-done": node.attrs.done.toString(),
          "data-id": node.attrs.id.toString(),
          style: "display: flex;"
        },
        [
          "input",
          {
            type: "checkbox",
            "data-done": node.attrs.done.toString() ?? "false",
            id: node.attrs.id.toString()
          }
        ],
        [
          "label",
          { style: "padding-inline: 8px", for: node.attrs.id.toString() },
          node.attrs.content
        ]
      ],
      parseDOM: [
        {
          tag: 'li[data-type="todo-item"]',
          getAttrs: (dom) => ({
            id: dom.getAttribute("data-id"),
            done: dom.getAttribute("data-done") === "true",
            content: dom.querySelector("label")!.textContent
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
      if (!state.doc.lastChild) return true
      let name = state.doc.lastChild.textContent ?? ""
      if (!name) return true
      db.transact(db.tx.item[id()].update({ name, completed: false }))
      if (dispatch) {
        let pos = findNodePosition(state.doc, state.doc.lastChild)
        dispatch(
          state.tr.replaceWith(
            pos,
            pos + state.doc.lastChild.nodeSize,
            todoSchema.node("paragraph")
          )
        )
      }
      return true
    }
  }),
  keymap(baseKeymap)
]

export function Editor() {
  let [mount, setMount] = useState<HTMLElement | null>(null)
  let [editorState, setEditorState] = useState<EditorState>()
  let db = useInstant()
  let query = db.useQuery({ item: {} })
  let [prevItems, setPrevItems] = useState()
  if (JSON.stringify(query.data?.item) !== JSON.stringify(prevItems)) {
    setEditorState(
      EditorState.create({
        schema: todoSchema,
        plugins: todoPlugins,
        doc: todoSchema.node("doc", null, [
          ...query.data.item.map((i) =>
            todoSchema.node("listItem", {
              done: i.completed,
              content: i.name,
              id: i.id
            })
          ),
          todoSchema.node("paragraph")
        ])
      })
    )
    setPrevItems(query.data?.item)
  }

  return (
    <div className="pt-2">
      {editorState ? (
        <ProseMirror
          mount={mount}
          state={editorState}
          dispatchTransaction={(tr) => {
            setEditorState((s) => s!.apply(tr))
          }}
        >
          <div
            className="outline-none list-none border-b p-4 border-sky-300"
            ref={setMount}
          />
        </ProseMirror>
      ) : null}
    </div>
  )
}
