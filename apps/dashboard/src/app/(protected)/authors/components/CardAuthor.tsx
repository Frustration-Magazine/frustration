"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import DialogEdit from "./DialogEdit";

import { useState } from "react";
import { Pen, Mail} from "lucide-react";

type Props = {
    name: string;
    email: string;
    xId: string;
    profilePicture: string;
}

function CardAuthor({ name, email, xId, profilePicture }: Props) {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
    }

  return (
    <Card>
        <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-xl">{name}</CardTitle>
            <div className="ml-auto">
                <Button size="icon" onClick={() => setOpen(true)}>
                    <Pen className="h-4 w-4" />
                </Button>
            </div>
            <DialogEdit open={open} onOpenChange={handleOpenChange} author={{ name, email, xId, profilePicture }} />
        </CardHeader>
        <CardContent>
            <a href={`mailto:${email}`} target="_blank" className="flex items-center gap-2 underline" rel="noopener noreferrer">
                <Mail className="h-4 w-4" />
                {email}
            </a>
            {/* <p>{xId}</p> */}
            {/* <Image src={profilePicture} alt={name} width={100} height={100} /> */}
        </CardContent>
    </Card>
  )
}

export default CardAuthor