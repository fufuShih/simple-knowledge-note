import { Plate, usePlateEditor } from "platejs/react";
import type { Value } from 'platejs';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@platejs/basic-nodes/react';
import { Editor, EditorContainer } from "@/components/ui/editor";

import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';

const initialValue: Value = [
  {
    type: 'p',
    children: [
      { text: 'Hello! Try out the ' },
      { text: 'bold', bold: true },
      { text: ', ' },
      { text: 'italic', italic: true },
      { text: ', and ' },
      { text: 'underline', underline: true },
      { text: ' formatting.' },
    ],
  },
];

interface ContentAreaProps {}

const ContentArea: React.FC<ContentAreaProps> = () => {
  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin], // Add the mark plugins
    value: initialValue,         // Set initial content
  });

  return (
    <section className="flex-1 bg-white p-6 overflow-y-auto scrollbar-hide h-full">
      <div id="top-toolbar" className="sticky top-0 z-10 my-4">
        <div id="node-tabs">
          <button className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
            <span className="text-sm font-medium">Heading</span>
          </button>
          <button className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
            <span className="text-sm font-medium">Paragraph</span>
          </button>
          <button className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
            <span className="text-sm font-medium">List</span>
          </button>
          <button className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
            <span className="text-sm font-medium">Quote</span>
          </button>
          <button className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200"></button>
        </div>
        <h1 className="text-2xl font-bold">Default title</h1>
      </div>
      <Plate editor={editor}>
        <FixedToolbar className="justify-start rounded-t-lg">
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
        </FixedToolbar>
        <EditorContainer>     
          <Editor placeholder="Type..." />
        </EditorContainer>
      </Plate>
    </section>
  )
}

export default ContentArea
