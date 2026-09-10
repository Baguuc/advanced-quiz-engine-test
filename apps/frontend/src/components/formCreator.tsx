import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function FormCreator() {
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline">Stwórz ankietę</Button>} />
            </form>
        </Dialog>
    )
}

export {FormCreator};