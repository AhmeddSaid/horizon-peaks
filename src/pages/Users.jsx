import UserTable from "../features/users/UserTable";
import AddUser from "../features/users/AddUser";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useUser } from "../features/authentication/useUser";

function NewUsers() {
  const { user } = useUser();
  const isAdmin = user?.user_metadata?.role === "Admin";

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">User Management</Heading>
      </Row>

      <Row>
        <UserTable />
        {isAdmin && <AddUser />}
      </Row>
    </>
  );
}

export default NewUsers;
