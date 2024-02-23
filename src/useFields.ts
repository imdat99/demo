import React from 'react'
import { generateId } from './Utils'
import convertToArrayPayload from './Utils/convertToArrayPayload'
import appendAt from "./Utils/append"
import { cloneDeep } from 'lodash'

const useFields = (props: any) => {
    const { control, name, keyName = 'id' } = props
    const [fields, setFields] = React.useState<any[]>(
        control._getFieldArray(name)
    )
    const _actioned = React.useRef(false)
    const ids = React.useRef<string[]>(
        control._getFieldArray(name).map(generateId)
    )
    const updateValues = React.useCallback(
        (updatedFieldArrayValues: any) => {
            _actioned.current = true
            control._updateFieldArray(name, updatedFieldArrayValues)
        },
        [control, name]
    )
    const append = (
        value:
            | any
            | any[],
        _options?: any
    ) => {
        const appendValue = convertToArrayPayload(cloneDeep(value))
        const updatedFieldArrayValues = appendAt(
            control._getFieldArray(name),
            appendValue
        )
        console.log("updatedFieldArrayValues", updatedFieldArrayValues)
        // console.log("updatedFieldArrayValues",name, control._getFieldArray(name), updatedFieldArrayValues)
        // // control._names.focus = getFocusFieldName(
        // //     name,
        // //     updatedFieldArrayValues.length - 1,
        // //     options
        // // )
        // ids.current = appendAt(ids.current, appendValue.map(generateId));
        updateValues(updatedFieldArrayValues)
        setFields(updatedFieldArrayValues)
        // control._updateFieldArray(name, updatedFieldArrayValues, appendAt, {
        //     argA: fillEmptyArray(value),
        // })
    }
    return {
        fields: React.useMemo(
            () =>
                fields.map((field, index) => ({
                    ...field,
                    [keyName]: ids.current[index] || generateId(),
                })) as any[],
            [fields, keyName]
        ),
        remove: (index: number) => {},
        append: React.useCallback(append, [updateValues, name, control]),
    }
}
export default useFields
