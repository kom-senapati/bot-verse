interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ name, className, type, ...props }: InputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-lg font-medium text-neutral-700"
      >
        Name:
      </label>
      <input
        type={type}
        {...props}
        name={name}
        className="mt-1 block w-full border rounded-md p-3 text-lg
                bg-white dark:bg-dark focus:outline-none dark:border-darker
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                transition duration-200 ease-in-out shadow-sm"
      />
    </div>
  );
}
