"use client";
import { db, storage } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import DropzoneComponent from "react-dropzone";

export default function Dropzone() {
  // max file size 20MB
  const maxSize = 20000000;

  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        // upload file
        await uploadPost(file);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadPost = async (selectdFile: File) => {
    if (loading) return;
    if (!user) return;

    setLoading(true);

    // add doc to users/userID/files/
    const docRef = await addDoc(collection(db, "users", user.id, "files"), {
      userId: user.id,
      fullName: user.fullName,
      fileName: selectdFile.name,
      profileImg: user.imageUrl,
      timestamp: serverTimestamp(),
      type: selectdFile.type,
      size: selectdFile.size,
    });

    // upload file to storage
    const storageRef = ref(storage, `users/${user.id}/files/${docRef.id}`);
    await uploadBytes(storageRef, selectdFile);
    const downloadURL = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "users", user.id, "files", docRef.id), {
      downloadURL: downloadURL,
    });

    setLoading(false);
  };

  return (
    <div>
      <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
        {({ getRootProps, getInputProps, isDragReject, isDragActive, fileRejections }) => {
          const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;

          return (
            <section className="m-4">
              <div
                {...getRootProps()}
                className={cn(
                  "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                  isDragActive
                    ? "bg-[#a1b7de] text-white animate-pulse"
                    : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
                )}
              >
                <input {...getInputProps()} />
                {!isDragActive && "Click here or drop a file to upload!"}
                {isDragActive && !isDragReject && "Drop to upload this file!"}
                {isDragReject && "File type not accepted, sorry!"}
                {isFileTooLarge && <div className="mt-2">File is too large.</div>}
              </div>
            </section>
          );
        }}
      </DropzoneComponent>
    </div>
  );
}
