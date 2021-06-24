const enablePermission = async (roleType, controller, action) => {
  try {
    const roles = await strapi.query('role', 'users-permissions').findOne({ type: roleType });
    const rolePermission = roles.permissions.find((permission) => {
      return (
        permission.type === 'application' &&
        permission.controller === controller &&
        permission.action === action.toLowerCase()
      );
    });
    strapi.query('permission', 'users-permissions').update(
      { id: rolePermission.id },
      {
        ...rolePermission,
        enabled: true,
      }
    );
  } catch (err) {
    strapi.log.error(`Bootstrap script: Could not update settings. ${controller} - ${action}`);
  }
};

const crudActions = ['create', 'count', 'delete', 'find', 'findone', 'update'];
const readOnlyActions = ['find', 'findone'];

const initPermissions = async () => {
  for (let action of readOnlyActions) {
    //Public
    await enablePermission('public', 'settings', 'find');
    await enablePermission('public', 'course', action);
    await enablePermission('public', 'lecture', action);
    await enablePermission('public', 'language', action);
    await enablePermission('public', 'profile', action);
    await enablePermission('public', 'tag', action);
    await enablePermission('public', 'question', 'find');

    // Authentication
    await enablePermission('authenticated', 'settings', 'find');
    await enablePermission('authenticated', 'course', action);
    await enablePermission('authenticated', 'lecture', action);
    await enablePermission('authenticated', 'language', action);
    await enablePermission('authenticated', 'profile', action);

    // Teacher
    await enablePermission('teacher', 'language', action);
    await enablePermission('teacher', 'tag', action);
  }

  for (let action of crudActions) {
    // Teacher
    await enablePermission('teacher', 'lecture', action);
    await enablePermission('teacher', 'course', action);
    await enablePermission('teacher', 'profile', action);
  }

  await enablePermission('teacher', 'course', 'findoneforteacher');
  await enablePermission('teacher', 'course', 'findforteacher');
  await enablePermission('teacher', 'course', 'patchcourse');
  await enablePermission('teacher', 'lecture', 'import');
  await enablePermission('teacher', 'lecture', 'bulkUpdate');

  await enablePermission('authenticated', 'profile', 'create');
  await enablePermission('authenticated', 'profile', 'update');
  await enablePermission('authenticated', 'pr', 'create');
  await enablePermission('authenticated', 'rating', 'create');
  await enablePermission('authenticated', 'question', 'create');

  // this is needed to create profile on signup
  await enablePermission('public', 'profile', 'create');
};

module.exports = {
  initPermissions,
};
