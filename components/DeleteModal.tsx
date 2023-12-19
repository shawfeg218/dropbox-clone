"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db, storage } from "@/lib/firebase";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useToast } from "./ui/use-toast";

export function DeleteModal() {
  const { user } = useUser();
  const { toast } = useToast();

  const [isDeleteModalOpen, setIsDeleteModalOpen, fileId] = useAppStore((state) => [
    state.isDeleteModalOpen,
    state.setIsDeleteModalOpen,
    state.fileId,
  ]);

  const deleteFile = async () => {
    if (!user || !fileId) return;

    try {
      toast({ title: "Deleting file..." });
      const fileRef = ref(storage, `users/${user.id}/files/${fileId}`);
      await deleteObject(fileRef);
      // console.log("File deleted from storage successfully");
      await deleteDoc(doc(db, "users", user.id, "files", fileId));
      // console.log("File deleted from db successfully");
      toast({ title: "File deleted successfully" });
    } catch (error) {
      toast({ title: "Error deleting file", variant: "destructive" });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => {
        setIsDeleteModalOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the file!
          </DialogDescription>
        </DialogHeader>

        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <span>Cancel</span>
          </Button>

          <Button type="submit" size="sm" className="px-3 flex-1" onClick={() => deleteFile()}>
            <span>Delete</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
