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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Stwórz ankietę</DialogTitle>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="formName">Podaj nazwę ankiety*</Label>
                            <Input id="formName" placeholder="Nazwa ankiety" required />
                        </Field>
                        <Field>
                            <Label htmlFor="formDescription">Podaj opis ankiety</Label>
                            <Input id="formDescription" placeholder="Opis ankiety" />
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <Button type="submit">Stwórz</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export {FormCreator};