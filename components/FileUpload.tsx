'use client'

import { UploadDropzone } from "@/lib/uploadthing";
import { X } from 'lucide-react'

import '@uploadthing/react/styles.css'
import Image from "next/image";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'serverImage' | 'messageFile'
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value,
  endpoint
}) => {
  const fileType = value?.split('.').pop()

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image 
          src={value}
          fill
          alt="upload"
          className="rounded-full"
        />
        <button
          onClick={() => onChange('')}
          type="button"
          className="
            absolute 
            top-0 
            right-0 
            bg-red-500 
            text-white 
            rounded-full 
            p-1 
            shadow-sm
            "
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    )
  }
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(`ERROR! ${error.message}`);
      }}
    />
  )
}

export default FileUpload
