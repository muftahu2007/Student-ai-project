import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageVariants, itemVariants } from './Shared';

interface MyDocumentsProps {
  documents: any[];
  setSelectedDoc: (doc: any) => void;
  setAiMode: (mode: any) => void;
  setAiResult: (res: string) => void;
  handleDeleteDocument: (id: number, e: React.MouseEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function MyDocuments({
  documents, setSelectedDoc, setAiMode, setAiResult,
  handleDeleteDocument, handleFileUpload,
}: MyDocumentsProps) {
  return (
    <motion.div key="documents" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
      <h2 className="font-display text-2xl font-bold mb-6">Your Documents</h2>
      {documents.length === 0 ? (
        <div className="relative overflow-hidden bg-card/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-16 text-center shadow-2xl shadow-black/40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 flex items-center justify-center mb-6 shadow-2xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0 duration-500">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-3 text-foreground">Your Library is Empty</h3>
            <p className="text-muted-foreground max-w-sm mb-8">Build your personal AI knowledge base by uploading study materials.</p>
            <Button onClick={() => document.getElementById('file-upload-docs')?.click()} className="rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
              <Plus className="mr-2 h-5 w-5" /> Add Document
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, idx) => (
            <motion.div
              key={idx} variants={itemVariants}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl shadow-black/40 hover:border-primary/30 hover:shadow-primary/5 transition-all group relative cursor-pointer"
              onClick={() => { setSelectedDoc(doc); setAiMode(null); setAiResult(''); }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 pr-6">
                  <h4 className="font-semibold line-clamp-2" title={doc.title}>{doc.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={(e: React.MouseEvent) => handleDeleteDocument(doc.id, e)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-red-500/10 text-muted-foreground/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Document"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
      <input type="file" id="file-upload-docs" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt,.docx" />
    </motion.div>
  );
}
