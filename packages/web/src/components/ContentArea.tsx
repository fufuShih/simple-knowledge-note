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


import { useState } from 'react';

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
  const [title, setTitle] = useState('Untitled Document');
  const [activeTab, setActiveTab] = useState('note1');
  
  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin], // Add the mark plugins
    value: initialValue,         // Set initial content
  });

  const noteTabs = [
    { id: 'note1', label: 'Getting Started' },
    { id: 'note2', label: 'Meeting Notes' },
    { id: 'note3', label: 'Ideas' },
  ];

  return (
    <section className="flex-1 bg-white h-full flex flex-col px-2 py-4">
      {/* Note Tabs Area - positioned directly under title */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {noteTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-r border-gray-200 relative transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 border-b-2 border-b-blue-500'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
              )}
            </button>
          ))}
          <button className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <span className="text-lg">+</span>
          </button>
        </div>
      </div>

      {/* Edit Title Area */}
      <div className="border-b border-gray-200 p-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-bold bg-transparent border-none outline-none focus:ring-0 p-0"
          placeholder="Enter document title..."
        />
      </div>

      {/* Plate Area */}
      <div className="flex-1 overflow-hidden">
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
      </div>
    </section>
  )
}

export default ContentArea
