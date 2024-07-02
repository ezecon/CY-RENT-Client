/* eslint-disable react/prop-types */
import { Input } from "@material-tailwind/react";

export default function TextInputField({
  label,
  type,
  size,
  register,
  errors,
  name,
  min
}) {
  return (
    <div>
      <Input label={label} type={type} size={size} min={min}{...register(name)} />
      <small className="text-red-500">
        {errors[name] && errors[name].message}
      </small>
    </div>
  );
}
