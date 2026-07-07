import UserTable from "../features/users/UserTable";
import AddUser from "../features/users/AddUser";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function NewUsers() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">User Management</Heading>
      </Row>

      <Row>
        <UserTable />
        <AddUser />
      </Row>
    </>
  );
}

export default NewUsers;
