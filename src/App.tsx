import "./App.css";
import get from "./Utils/get";
import useFields from "./useFields";
import useForm from "./useForm";

const defaultObj = {
  nested1: {
    arr: [{ name: "name", value: "valueaaa" }],
  },
  nested2: {
    obj1: {
      test: "default",
    },
  },
};
// const data = createState({
//     data: {
//         templateDatas: defaultObj
//     },
//     watch: console.log
// })
function App() {
  const { formValue, setFormValue, control } = useForm({
    defaultValue: { templateDatas: defaultObj },
  });
  const { fields, append, remove } = useFields({
    control,
    name: "templateDatas.nested1.arr",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValue(name, value);
  };
  return (
    <>
      <form>
        {fields.map((field, index) => {
          const name = `templateDatas.nested1.arr.${index}.name`;
          return (
            <input
              key={index}
              name={name}
              value={get(formValue, name)}
              onChange={handleChange}
            />
          );
        })}
      </form>
      <button
        onClick={() => {
          append({ name: "name", value: "value" });
        }}
      >
        Add
      </button>
    </>
  );
}

export default App;
