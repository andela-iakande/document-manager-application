import React, { propTypes } from 'react';
import RoleListRow from './RoleListRow';


const RoleList = ({ roles, deleteRole }) => {
        return (<table className="striped">
            <thead>
            
                <tr>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                </tr>
            </thead>
            <tbody>
                {roles.map(role =>
                    <RoleListRow key={role.id} role={role} deleteRole={deleteRole} />
                )}
            
            </tbody>
        </table>);
}

export default RoleList;
