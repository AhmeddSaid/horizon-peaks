import styled from "styled-components";
import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FormRow from "../../ui/FormRow";
import { useUpdateUser } from "./useUpdateUser";

const StyledSelect = styled.select`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

function EditUserForm({ userToEdit = {}, onCloseModal }) {
  const { isUpdating, updateUser } = useUpdateUser();
  const { id, email, full_name, role } = userToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email,
      fullName: full_name,
      role: role || "Moderator",
    },
  });
  const { errors } = formState;

  function onSubmit(data) {
    updateUser(
      { id, email: data.email, fullName: data.fullName, role: data.role },
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

      <FormRow label="Role">
        <StyledSelect
          id="role"
          disabled={isUpdating}
          {...register("role")}
        >
          <option value="Moderator">Moderator</option>
          <option value="Admin">Admin</option>
        </StyledSelect>
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
