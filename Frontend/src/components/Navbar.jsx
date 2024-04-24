import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  AvatarIcon,
} from "@nextui-org/react";
import axios from "axios";
// eslint-disable-next-line react/prop-types
export default function Navigationbar({ name }) {
  const logout = async () => {
    const response = await axios.post(
      "http://localhost:5000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    window.location.href = "/";
  };
  return (
    <Navbar>
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="text-xl font-bold">Project-todo</p>
      </NavbarBrand>

      <NavbarContent
        className="hidden gap-4 sm:flex"
        justify="center"
      ></NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              icon={<AvatarIcon name={name} />}
              as="button"
              className="transition-transform"
              name={name}
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="gap-2 h-14">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{name}</p>
            </DropdownItem>

            <DropdownItem key="logout" color="danger" onClick={logout}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
