import { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { HiOutlineSearch, HiOutlineShieldCheck, HiOutlineBan, HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

const AdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, filterRole]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filterRole) params.append("role", filterRole);
      const res = await axiosSecure.get(`/admin/users?${params}`);
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user display name
  const getUserName = (user) => user.name || user.displayName || "No Name";

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (!confirm(`Make ${getUserName(user)} ${newRole}?`)) return;
    try {
      await axiosSecure.patch(`/admin/users/${user._id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const toggleBlock = async (user) => {
    const action = user.blocked ? "unblock" : "block";
    if (!confirm(`${action} ${getUserName(user)}?`)) return;
    try {
      await axiosSecure.patch(`/admin/users/${user._id}/block`, { blocked: !user.blocked });
      toast.success(`User ${action}ed`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      getUserName(u).toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-ds-muted border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ds-text">Users Management</h1>
          <p className="text-ds-muted">Manage users and their roles</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-surface text-ds-text"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 max-w-xs relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 rounded-xl bg-ds-surface border border-ds-border/30 text-ds-text"
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ds-border/30 bg-ds-bg/30">
                <th className="text-left py-4 px-4 text-ds-muted font-medium">User</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Email</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Role</th>
                <th className="text-left py-4 px-4 text-ds-muted font-medium">Status</th>
                <th className="text-right py-4 px-4 text-ds-muted font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-ds-border/20 hover:bg-ds-bg/20">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            getUserName(user)
                          )}&background=598392&color=eff6e0`
                        }
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-ds-text font-medium">{getUserName(user)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-ds-muted">{user.email}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-ds-bg text-ds-muted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        user.blocked ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleRole(user)}
                        className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-purple-400"
                        title="Toggle Role"
                      >
                        <HiOutlineShieldCheck className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleBlock(user)}
                        className={`p-2 rounded-lg ${
                          user.blocked ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}
                        title={user.blocked ? "Unblock" : "Block"}
                      >
                        <HiOutlineBan className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ds-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-ds-surface text-ds-text disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-ds-muted">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-ds-surface text-ds-text disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
