export type MenuTreeItemType = API.SysMenuVO & {
  children?: MenuTreeItemType[]
}

export type MenuOptionsItemType = Omit<MenuTreeItemType, 'children'> & {
  label: string
  value: string
  children?: MenuOptionsItemType[]
}

export type RoleAuthRef = {}

export type RoleAuthProps = {
  roleId?: string
}
