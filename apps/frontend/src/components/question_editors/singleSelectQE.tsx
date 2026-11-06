function SingleSelectQE(props: {options, questionIndex: number, updateOption}) {
    return (<>
        <div>
            <ul>
                {props.options.map((option: { key: string; text: string }, optionIndex: number) => (
                    <li key={option.key}>
                        <input
                            value={option.text}
                            onChange={(e) => props.updateOption(props.questionIndex, optionIndex, e.target.value)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    </>)
}

export default SingleSelectQE