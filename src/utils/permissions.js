
export const Role = {
  Patient: 'Patient',
  Nurse: 'Nurse',
  Doctor: 'Doctor',
  Administrator: 'Administrator'
};

export const Permission = {
  ViewRecords: 'view_records',
  UpdateStatus: 'update_status',
  PrescribeMedication: 'prescribe_medication',
  ManageUsers: 'manage_users'
};

export const RolePermissions = {
  [Role.Patient]: [Permission.ViewRecords],
  [Role.Nurse]: [Permission.ViewRecords, Permission.UpdateStatus],
  [Role.Doctor]: [Permission.ViewRecords, Permission.UpdateStatus, Permission.PrescribeMedication],
  [Role.Administrator]: [Permission.ManageUsers]
};
