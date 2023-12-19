"use client";

import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function RenameModal() {
  const { user } = useUser();
  const [input, setInput] = useState("");

  const [isRenameModalOpen, setIsRenameModalOpen, fileId, fileName] = useAppStore((state) => [
    state.isRenameModalOpen,
    state.setIsRenameModalOpen,
    state.fileId,
    state.fileName,
  ]);

  const renameFile = async () => {
    if (!user || !fileId) return;

    try {
      await updateDoc(doc(db, "users", user.id, "files", fileId), { fileName: input });
    } catch (error) {
      alert("Error renaming file");
    } finally {
      setInput("");
      setIsRenameModalOpen(false);
    }
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => {
        setIsRenameModalOpen(isOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-2">Rename the File</DialogTitle>
        </DialogHeader>

        <Input
          defaultValue={fileName}
          onChange={(e) => setInput(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              renameFile();
            }
          }}
        />

        <div className="flex justify-end space-x-2 py-3">
          <Button
            size="sm"
            className="px-3"
            variant="ghost"
            onClick={() => setIsRenameModalOpen(false)}
          >
            <span>Cancel</span>
          </Button>

          <Button type="submit" size="sm" className="px-3" onClick={renameFile}>
            <span>Rename</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
