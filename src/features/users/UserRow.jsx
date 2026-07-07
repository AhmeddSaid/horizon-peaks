import styled from "styled-components";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import EditUserForm from "./EditUserForm";
import { useDeleteUser } from "./useDeleteUser";
import { useUser } from "../authentication/useUser";

const Avatar = styled.img`
  display: block;
  width: 4rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

const FullName = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Email = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-grey-500);
`;

const RoleTag = styled.span`
  text-transform: uppercase;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  width: fit-content;
  background-color: ${(props) =>
    props.role === "Admin" ? "var(--color-green-100)" : "var(--color-grey-100)"};
  color: ${(props) =>
    props.role === "Admin" ? "var(--color-green-700)" : "var(--color-grey-700)"};
`;

function UserRow({ user }) {
  const { isDeleting, deleteUser } = useDeleteUser();
  const { user: currentUser } = useUser();
  const { id: userId, email, full_name, role, avatar, created_at } = user;

  const isAdmin = currentUser?.user_metadata?.role === "Admin";

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Table.Row>
      <Avatar src={avatar || "default-user.jpg"} alt={`${full_name}'s avatar`} />
      <FullName>{full_name || "—"}</FullName>
      <Email>{email}</Email>
      <RoleTag role={role}>{role || "Moderator"}</RoleTag>
      <div>{formattedDate}</div>
      <div>
        {isAdmin && (
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={userId} />
              <Menus.List id={userId}>
                <Modal.Open opens="edit">
                  <Menus.Button icon={HiPencil}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="delete">
                  <Menus.Button icon={HiTrash}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit">
                <EditUserForm userToEdit={user} />
              </Modal.Window>

              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName="user"
                  disabled={isDeleting}
                  onConfirm={() => deleteUser(userId)}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        )}
      </div>
    </Table.Row>
  );
}

export default UserRow;
