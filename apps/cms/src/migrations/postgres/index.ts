import * as migration_20261102_134951_initial from './20261102_134951_initial';
import * as migration_20261104_130720_cms_workspace from './20261104_130720_cms_workspace';
import * as migration_20261105_105201_request_inbox from './20261105_105201_request_inbox';

export const migrations = [
  {
    up: migration_20261102_134951_initial.up,
    down: migration_20261102_134951_initial.down,
    name: '20261102_134951_initial',
  },
  {
    up: migration_20261104_130720_cms_workspace.up,
    down: migration_20261104_130720_cms_workspace.down,
    name: '20261104_130720_cms_workspace',
  },
  {
    up: migration_20261105_105201_request_inbox.up,
    down: migration_20261105_105201_request_inbox.down,
    name: '20261105_105201_request_inbox'
  },
];
