'use client';

import { deleteAvatarFetchDb } from "@/data/userData";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteAvaComp = () => {
    const router = useRouter()
    const handleDeleteAva = async () => {
        const { result, ok } = await deleteAvatarFetchDb();
        try {
        if (!ok) throw result.message;
        toast.success(result.message);
        router.push('/profile');
        router.refresh() 
        } catch (error) {
        toast.error(error as string);
        }
    }
  return (
    <div>
      <div
        className="button rounded-full px-3 py-1 before:bg-red-800 text-white cursor-pointer"
        onClick={handleDeleteAva}
      >
        Delete Avatar
      </div>
    </div>
  );
};

export default DeleteAvaComp;
