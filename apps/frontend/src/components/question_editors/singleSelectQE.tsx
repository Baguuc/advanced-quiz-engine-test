import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SingleSelectQE(props: {options: { key: string; text: string }[], questionIndex: number, updateOption: (questionIndex: number, optionIndex: number, value: string) => void, deleteOption: (questionIndex: number, optionIndex: number) => void, addOption: (questionIndex: number) => void}) {
    return (<>
        <div>
            <ul>
                {props.options.map((option: { key: string; text: string }, optionIndex: number) => (
                    <li key={option.key}>
                        <div className="flex items-center justify-content: center; gap-2 m-1">
                            <Input
                                value={option.text}
                                onChange={(e) => {props.updateOption(props.questionIndex, optionIndex, e.target.value)}}
                                className="mb-1"
                            />

                            <Button
                                variant="outline"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold px-2 py-1"
                                size="sm"
                                onClick={() => props.deleteOption(props.questionIndex, optionIndex)}
                            >
                                Usuń
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
            <Button variant="secondary" onClick={() => props.addOption(props.questionIndex)}>
                Dodaj Opcję
            </Button>
        </div>
    </>)
}

export default SingleSelectQE