'use client';
import { EditAvatarFetchDb } from '@/data/userData';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'react-toastify';

const EditAvaComp = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // trigger button click
  const handleClickEditAva = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // men-Trigger hidden input file click
    }
  };

  // Handle pemilihan file
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', event.target.files[0]);
        try {
            const { result, ok } = await EditAvatarFetchDb(formData);
            if (!ok) throw new Error(result.message);
            toast.success(result.message as string);
            router.push("/profile");
            router.refresh()
          } catch (error) {
            toast.error(`${(error as Error).message}`);
          }
    }
  };

  return (
    <div>
      <div
        className="button rounded-full px-3 py-1 bg-transparent text-white"
        onClick={handleClickEditAva}
      >
        Edit Avatar
      </div>

      {/* Hidden input file */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange} // Handle pemilihan file
      />
    </div>
  );
};

export default EditAvaComp;
