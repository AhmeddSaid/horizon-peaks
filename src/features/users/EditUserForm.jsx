import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import { useUpdateUser } from "./useUpdateUser";

function EditUserForm({ userToEdit = {}, onCloseModal }) {
  const { isUpdating, updateUser } = useUpdateUser();
  const { id, email, full_name } = userToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email,
      fullName: full_name,
    },
  });
  const { errors } = formState;

  function onSubmit(data) {
    updateUser(
      { id, email: data.email, fullName: data.fullName },
      {
        onSuccess: () => {
          onCloseModal?.();
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isUpdating}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isUpdating}
          {...register("fullName", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          disabled={isUpdating}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Save changes</Button>
      </FormRow>
    </Form>
  );
}

export default EditUserForm;
