import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  CheckCircle,
  Clock,
  XCircle,
  Users,
  PartyPopper,
  CalendarDays,
  MapPin,
  AlarmClock,
  Ticket,
  LogOut,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("corpers");
  const [corpers, setCorpers] = useState([]);
  const [nonCorpers, setNonCorpers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [eventInfo, setEventInfo] = useState({
    date: "",
    venue: "",
    time: "",
    ticketNote: "",
  });
  const [adminName, setAdminName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 20;

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      toast.error("Session expired or unauthorized. Please log in.");
      window.location.href = "/admin-login";
    } else {
      fetchCorpers();
      fetchNonCorpers();
      fetchAdminName();
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, activeTab]);

  const fetchAdminName = () => {
    const storedAdmin = JSON.parse(localStorage.getItem("adminData"));
    if (storedAdmin) setAdminName(storedAdmin.username || "Admin");
  };

  const fetchCorpers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/admin/corpers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setCorpers(data);
      else {
        toast.error(data.message || "Failed to fetch corp members.");
        setCorpers([]);
      }
    } catch (err) {
      toast.error("Error fetching corp members.");
      setCorpers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNonCorpers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/admin/noncorpers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setNonCorpers(data);
      else {
        toast.error(data.message || "Failed to fetch non-corpers.");
        setNonCorpers([]);
      }
    } catch (err) {
      toast.error("Error fetching non-corpers.");
      setNonCorpers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, role, status) => {
    const endpoint =
      role === "corper"
        ? `https://ibnw-pop-party-ticket.onrender.com/admin/corpers/${id}/status`
        : `https://ibnw-pop-party-ticket.onrender.com/admin/noncorpers/${id}/status`;

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`User ${status} successfully.`);
        role === "corper" ? fetchCorpers() : fetchNonCorpers();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      toast.error("Error updating status.");
    }
  };
const handleEventUpdate = async () => {
  if (!eventInfo.date && !eventInfo.venue && !eventInfo.time && !eventInfo.ticketNote) {
    toast.error("Please provide at least one field to update.");
    return;
  }

  setLoading(true);
  try {
    const payload = { ...eventInfo };

    const response = await fetch('https://ibnw-pop-party-ticket.onrender.com/admin/event', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      toast.error(`Update failed: ${errData.error || response.statusText}`);
      return;
    }

    toast.success("Event info updated successfully!");
    fetchCorpers();
    fetchNonCorpers();
  } catch (err) {
    toast.error("Error updating event info.");
  } finally {
    setLoading(false);
  }
};


  const handleArtworkUpload = async () => {
  if (!selectedFile) {
    toast.error("No file selected.");
    return;
  }

  const formData = new FormData();
  formData.append("artwork", selectedFile);

  try {
    const token = localStorage.getItem("adminToken");
    console.log("Uploading artwork with token:", token);

    const res = await fetch("https://ibnw-pop-party-ticket.onrender.com/admin/upload-artwork", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);

    if (res.ok) {
      toast.success("Artwork uploaded successfully!");
      localStorage.setItem("eventArtwork", data.artworkUrl);
      setSelectedFile(null);
    } else {
      toast.error(data.error || "Failed to upload artwork.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error("Error uploading artwork.");
  }
};

  const filterUsers = (users) => {
    return users.filter((user) => {
      const nameMatch =
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = !statusFilter || user.status === statusFilter;
      return nameMatch && statusMatch;
    });
  };

  const paginateUsers = (users) => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return users.slice(start, start + USERS_PER_PAGE);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "/admin-login";
  };

  const allUsers = [...corpers, ...nonCorpers];
  const statusCounts = allUsers.reduce(
    (acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    },
    { approved: 0, rejected: 0, pending: 0 }
  );

  const filteredUsers =
    activeTab === "corpers" ? filterUsers(corpers) : filterUsers(nonCorpers);
  const paginatedUsers = paginateUsers(filteredUsers);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const UserCard = ({ user, role, expanded, onToggle }) => (
    <div className="adminDash-card">
      <div className="adminDash-card-header">
        <div>
          <strong>{user.firstName} {user.lastName}</strong>
          <p>{user.email}</p>
        </div>
        <button onClick={onToggle} className={`adminDash-toggleBtn ${expanded ? "open" : ""}`}>
          {expanded ? "Hide" : "View"}
        </button>
      </div>
      {expanded && (
        <div className="adminDash-card-details">
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          {role === "corper" && <p><strong>State Code:</strong> {user.stateCode || "N/A"}</p>}
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Local Government:</strong> {user.localGov}</p>
          <p>
            <strong>Receipt:</strong>{" "}
            {user.receipt ? (
              <a href={user.receipt} target="_blank" rel="noopener noreferrer">View</a>
            ) : (
              "Not uploaded"
            )}
          </p>
          <p><strong>Status:</strong> {user.status}</p>
          <div className="adminDash-actionButtons">
            <button className="approve" onClick={() => handleStatusUpdate(user._id, role, "approved")}>Approve</button>
            <button className="reject" onClick={() => handleStatusUpdate(user._id, role, "rejected")}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="adminDash-container">
      <ToastContainer />
      <nav className="adminDash-navbar">
        <h2><PartyPopper size={22} /> Welcome, {adminName || "Admin"}</h2>
        <button onClick={handleLogout} className="adminDash-logoutBtn">
          <LogOut size={20} /> Logout
        </button>
      </nav>

      <div className="adminDash-statusSummary">
        <div className="status approved"><CheckCircle size={18} /> Approved: <strong>{statusCounts.approved}</strong></div>
        <div className="status pending"><Clock size={18} /> Pending: <strong>{statusCounts.pending}</strong></div>
        <div className="status rejected"><XCircle size={18} /> Rejected: <strong>{statusCounts.rejected}</strong></div>
      </div>

      <div className="adminDash-tabs">
        <button className={activeTab === "corpers" ? "active" : ""} onClick={() => setActiveTab("corpers")}>
          <Users size={16} /> Corp Members
        </button>
        <button className={activeTab === "noncorpers" ? "active" : ""} onClick={() => setActiveTab("noncorpers")}>
          <Users size={16} /> Non-Corpers
        </button>
      </div>

      <div className="adminDash-controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={loading}
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="adminDash-eventUpdateForm">
        <h3>Update Event Info for All Users</h3>
        <div className="adminDash-eventFields">
          <label><CalendarDays size={16} /> Date:
            <input type="date" value={eventInfo.date} onChange={(e) => setEventInfo((prev) => ({ ...prev, date: e.target.value }))} />
          </label>
          <label><MapPin size={16} /> Venue:
            <input type="text" placeholder="Venue" value={eventInfo.venue} onChange={(e) => setEventInfo((prev) => ({ ...prev, venue: e.target.value }))} />
          </label>
          <label><AlarmClock size={16} /> Time:
            <input type="time" value={eventInfo.time} onChange={(e) => setEventInfo((prev) => ({ ...prev, time: e.target.value }))} />
          </label>
          <label><Ticket size={16} /> Ticket Note:
            <input type="text" placeholder="Ticket Note" value={eventInfo.ticketNote} onChange={(e) => setEventInfo((prev) => ({ ...prev, ticketNote: e.target.value }))} />
          </label>
          <button onClick={handleEventUpdate} disabled={loading} className="adminDash-updateEventBtn">
            Update Event Info
          </button>
        </div>

        <div className="adminDash-artworkUpload">
          <h3>Upload Event Artwork</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          {selectedFile && (
            <div className="adminDash-preview">
              <img src={URL.createObjectURL(selectedFile)} alt="Artwork Preview" />
              <button onClick={handleArtworkUpload}>Upload Artwork</button>
            </div>
          )}
        </div>
      </div>

      <div className="adminDash-userList">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          paginatedUsers.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              role={activeTab === "corpers" ? "corper" : "noncorper"}
              expanded={expandedUserId === user._id}
              onToggle={() => setExpandedUserId((prev) => (prev === user._id ? null : user._id))}
            />
          ))
        )}
      </div>

      {!loading && filteredUsers.length > USERS_PER_PAGE && (
        <div className="adminDash-pagination">
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
