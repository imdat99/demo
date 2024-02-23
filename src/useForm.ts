import React from "react";
import { createState } from "./Utils";
import set from "./Utils/set";
import useMounted from "./useMounted";
import compact from "./Utils/compact";
import get from "./Utils/get";

const useForm = (props: { defaultValue: Record<string, any> }) => {
  const { defaultValue } = props;
  const isMount = useMounted();
  const [formState, updateFormState] = React.useState({
    error: {},
    action: false,
    mount: false,
    watch: false,
  });
  const [formValue, updateFormValue] = React.useState(defaultValue);
  const _formControl = React.useRef<any>();

  React.useEffect(() => {
    updateFormState((prev) => ({ ...prev, mount: isMount }));
  }, [isMount]);

  const handleWatch = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (obj: typeof props.defaultValue, _fullPath: string) => {
      console.log("obj", obj);
      updateFormValue(obj);
    },
    [props]
  );
  if (!_formControl.current) {
    _formControl.current = createState({
      data: defaultValue,
      watch: handleWatch,
    });
  }
  const _getFieldArray = <T>( name: string ): Partial<T>[] => compact(get(formState.mount ? formValue : defaultValue, name, []));
  const _updateFieldArray = (name: string, value: unknown) => {
    console.log(name, value)
  }
  return {
    formState,
    formValue,
    control: { _getFieldArray, _updateFieldArray },
    setFormValue: (path: string, value: unknown) => {
      console.log("_formControl.current", _formControl.current);
      set(_formControl.current, path, value);
    },
  };
};

export default useForm;
