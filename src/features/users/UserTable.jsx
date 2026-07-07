import Spinner from "../../ui/Spinner";
import UserRow from "./UserRow";
import { useUsers } from "./useUsers";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function UserTable() {
  const { isLoading, users } = useUsers();

  if (isLoading) return <Spinner />;

  if (!users?.length) return <Empty resourceName="users" />;

  return (
    <Menus>
      <Table columns="0.6fr 1.5fr 2fr 1fr 1.2fr 0.5fr">
        <Table.Header>
          <div>Avatar</div>
          <div>Full name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Created at</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={users}
          render={(user) => <UserRow user={user} key={user.id} />}
        />
      </Table>
    </Menus>
  );
}

export default UserTable;
