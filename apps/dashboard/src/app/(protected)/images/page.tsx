import { redirectIfNotSignedIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import { ImagePicker } from "@/app/_components/ImagePicker";

export default async function Page() {
  await redirectIfNotSignedIn();

  return (
    <ImagePicker
      trigger={
        <DialogTrigger asChild>
          <Button>
            <ImageIcon />
            Consulter la bibliothèque d'images
          </Button>
        </DialogTrigger>
      }
    />
  );
}
