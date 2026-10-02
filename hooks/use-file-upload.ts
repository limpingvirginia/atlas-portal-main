"use client";

import { useState, useCallback } from "react";

export type FileUploadFile = {
  file: File;
  preview: string;
};

export function useFileUpload() {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const onUpload = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const onRemove = useCallback((index: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].preview);
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  return { files, onUpload, onRemove };
}
