"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: any;
};

function DialogEdit({ open, onOpenChange, author }: Props) {
  const [editedAuthor, setEditedAuthor] = useState(author);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[500px]">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-bold">{author.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="flex flex-col gap-4">
            <Label className="flex flex-col gap-2">
              <span>Name</span>
              <Input
                type="text"
                disabled
                value={editedAuthor.name}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              <span>Email</span>
              <Input
                type="email"
                value={editedAuthor.email}
                onChange={(e) => setEditedAuthor({ ...editedAuthor, email: e.target.value })}
              />
            </Label>
            <Label className="flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                X
              </span>
              <Input
                type="text"
                value={editedAuthor.xId}
                onChange={(e) => setEditedAuthor({ ...editedAuthor, xId: e.target.value })}
              />
            </Label>
          </div>
        </DialogDescription>
      <DialogFooter className="mt-6">
        <Button variant="destructive" onClick={() => onOpenChange(false)}>
          Annuler
        </Button>
        <Button>Modifier</Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogEdit;
