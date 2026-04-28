import { create } from 'zustand';

const useEditorStore = create((set) => ({
  files: [],
  currentFile: null,
  projectId: null,

  setFiles: (files) => set({ files }),
  setCurrentFile: (file) => set({ currentFile: file }),
  setProjectId: (id) => set({ projectId: id }),

  updateFile: (fileId, content) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, content } : f
      )
    })),

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file]
    })),

  deleteFile: (fileId) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId)
    }))
}));

export default useEditorStore;
