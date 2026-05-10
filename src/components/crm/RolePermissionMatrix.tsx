import { permissionActions, permissionModules } from '../../constants/permissions';
import { Card } from '../ui/Card';

export function RolePermissionMatrix() {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-xs">
        <thead className="border-b border-border-subtle bg-bg-deep/50">
          <tr>
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Module</th>
            {permissionActions.map((action) => (
              <th key={action} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">{action}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {permissionModules.map((module, rowIndex) => (
            <tr key={module} className="hover:bg-white/5">
              <td className="px-5 py-4 font-bold text-white">{module}</td>
              {permissionActions.map((action, colIndex) => (
                <td key={action} className="px-4 py-4 text-center">
                  <input type="checkbox" defaultChecked={rowIndex < 4 || colIndex < 3} className="h-4 w-4 accent-[#A3141C]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
