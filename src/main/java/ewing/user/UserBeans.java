package ewing.user;

import ewing.query.*;

/**
 * 管理应用中所有的实体Bean。
 */
public interface UserBeans {

    QUser qUser = QUser.user;
    QUserRole qUserRole = QUserRole.userRole;
    QRole qRole = QRole.role;
    QRolePermission qRolePermission = QRolePermission.rolePermission;
    QPermission qPermission = QPermission.permission;
    QAuthority qAuthority = QAuthority.authority;
    QRoleAuthority qRoleAuthority = QRoleAuthority.roleAuthority;

}
