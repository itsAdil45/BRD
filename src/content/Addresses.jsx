"use client";
import React, { useState, useEffect } from "react";
import useGet from "@/customHooks/useGet";
import usePost from "@/customHooks/usePost";
import usePut from "@/customHooks/usePut";
import useDelete from "@/customHooks/useDelete";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  type: "shipping",
  is_default: false,
  notes: "",
};
const ADDRESS_TYPES = ["shipping", "billing"];

export default function Addresses() {
  const {
    data: addressData,
    loading: fetchLoading,
    refetch,
  } = useGet("/addresses");
  const { postData, loading: posting } = usePost();
  const { put, loading: putting } = usePut();
  const { deleteData, loading: deleting } = useDelete();

  const [addresses, setAddresses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    if (addressData?.data) setAddresses(addressData.data);
  }, [addressData]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };
  const openEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "",
      type: addr.type || "shipping",
      is_default: !!addr.is_default,
      notes: addr.notes || "",
    });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await put(`/addresses/${editingId}`, form);
        toast.success("Address updated!");
      } else {
        await postData("/addresses", form);
        toast.success("Address added!");
      }
      closeModal();
      refetch();
    } catch {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteData(`/addresses/${id}`);
    if (result !== null) {
      toast.success("Address deleted.");
      setDeleteConfirmId(null);
      refetch();
    } else toast.error("Failed to delete address.");
  };

  const isSaving = posting || putting;

  return (
    <>
      <div className="dashboard-content-wrap two">
        <div className="addr-header">
          <h6 style={{ margin: 0 }}>Saved addresses</h6>
          <button
            className="primary-btn btn-hover two"
            onClick={openAdd}
            style={{ border: "none" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add address
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          {fetchLoading ? (
            <div className="addr-empty">
              <span className="addr-spinner" />
              <p>Loading addresses…</p>
            </div>
          ) : addresses.length === 0 ? (
            <div className="addr-empty">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ccc"
                strokeWidth="1.5"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <p>No addresses saved yet.</p>
              <button
                className="primary-btn btn-hover two"
                style={{ marginTop: 12 }}
                onClick={openAdd}
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="addr-card-grid">
              {addresses.map((addr) => (
                <div key={addr.id} className="addr-card">
                  <div className="addr-card-top">
                    <span className="addr-card-street">{addr.street}</span>
                    <div className="addr-badges">
                      <span className={`addr-badge addr-badge--${addr.type}`}>
                        {addr.type}
                      </span>
                      {addr.is_default ? (
                        <span className="addr-badge addr-badge--default">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          default
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="addr-card-loc">
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""}
                    <br />
                    {addr.zip ? `${addr.zip} · ` : ""}
                    {addr.country}
                  </div>
                  {addr.notes && (
                    <div className="addr-card-notes">{addr.notes}</div>
                  )}
                  <div className="addr-card-actions">
                    <button
                      className="addr-btn-edit"
                      onClick={() => openEdit(addr)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="addr-btn-del"
                      onClick={() => setDeleteConfirmId(addr.id)}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div className="addr-overlay" onClick={closeModal}>
          <div className="addr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="addr-modal-header">
              <h6>{editingId ? "Edit address" : "Add new address"}</h6>
              <button className="addr-modal-close" onClick={closeModal}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="addr-modal-body">
                <div className="addr-field-grid">
                  <div className="addr-field addr-field--full">
                    <label>
                      Street address <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={handle}
                      placeholder="Main St 10"
                      required
                    />
                  </div>
                  <div className="addr-field">
                    <label>
                      City <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handle}
                      placeholder="Dubai"
                      required
                    />
                  </div>
                  <div className="addr-field">
                    <label>State / emirate</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handle}
                      placeholder="Dubai"
                    />
                  </div>
                  <div className="addr-field">
                    <label>ZIP / postal code</label>
                    <input
                      type="text"
                      name="zip"
                      value={form.zip}
                      onChange={handle}
                      placeholder="00000"
                    />
                  </div>
                  <div className="addr-field">
                    <label>
                      Country <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={form.country}
                      onChange={handle}
                      placeholder="UAE"
                      required
                    />
                  </div>
                  <div className="addr-field">
                    <label>Address type</label>
                    <select name="type" value={form.type} onChange={handle}>
                      {ADDRESS_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="addr-field addr-field--full">
                    <label>Notes</label>
                    <input
                      type="text"
                      name="notes"
                      value={form.notes}
                      onChange={handle}
                      placeholder="Near tower, ring twice…"
                    />
                  </div>
                  <div className="addr-field--full">
                    <label className="addr-check">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={form.is_default}
                        onChange={handle}
                      />
                      <span>Set as default address</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="addr-modal-footer">
                <button
                  type="button"
                  className="addr-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary-btn btn-hover two"
                  disabled={isSaving}
                  style={{ border: "none" }}
                >
                  {isSaving ? (
                    <>
                      <span className="addr-spinner-sm" /> Saving…
                    </>
                  ) : editingId ? (
                    "Update address"
                  ) : (
                    "Add address"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirmId && (
        <div className="addr-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div
            className="addr-modal addr-modal--sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="addr-modal-header">
              <h6>Delete address</h6>
              <button
                className="addr-modal-close"
                onClick={() => setDeleteConfirmId(null)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="addr-del-body">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#A32D2D"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
              <p>
                Are you sure you want to delete this address? This action cannot
                be undone.
              </p>
            </div>
            <div className="addr-modal-footer">
              <button
                className="addr-cancel-btn"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="addr-delete-confirm-btn"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="addr-spinner-sm" /> Deleting…
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{css}</style>
    </>
  );
}

const css = `
  .addr-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .addr-header .primary-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    font-size: .85rem;
  }

  /* ── card grid ── */
  .addr-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }
  .addr-card {
    background: #fff;
    border: 1px solid #ebebeb;
    border-radius: 12px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .addr-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }
  .addr-card-street {
    font-size: .9rem;
    font-weight: 600;
    color: #222;
    line-height: 1.4;
  }
  .addr-badges {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
  .addr-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: .7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    text-transform: capitalize;
    letter-spacing: .04em;
    white-space: nowrap;
  }
  .addr-badge--shipping { background: #E6F1FB; color: #185FA5; border: 1px solid #B5D4F4; }
  .addr-badge--billing  { background: #EEEDFE; color: #534AB7; border: 1px solid #CECBF6; }
  .addr-badge--default  { background: #E1F5EE; color: #0F6E56; border: 1px solid #9FE1CB; }
  .addr-card-loc {
    font-size: .83rem;
    color: #666;
    line-height: 1.55;
  }
  .addr-card-notes {
    font-size: .78rem;
    color: #999;
    font-style: italic;
    border-top: 1px solid #f2f2f2;
    padding-top: 8px;
  }
  .addr-card-actions {
    display: flex;
    gap: 8px;
    border-top: 1px solid #f2f2f2;
    padding-top: 10px;
    margin-top: auto;
  }
  .addr-btn-edit, .addr-btn-del {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 7px 0;
    border-radius: 8px;
    font-size: .75rem;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all .15s;
    background: transparent;
  }
  .addr-btn-edit {
    color: #333;
    background: #f6f6f6;
    border-color: #e8e8e8;
  }
  .addr-btn-edit:hover { background: #eee; border-color: #d5d5d5; }
  .addr-btn-del  { color: #A32D2D; border-color: #F7C1C1; background: transparent; }
  .addr-btn-del:hover  { background: #FCEBEB; }

  /* ── empty state ── */
  .addr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 56px 20px;
    color: #aaa;
    font-size: .88rem;
    gap: 8px;
  }

  /* ── overlay / modal ── */
  .addr-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
    animation: fadeIn .18s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .addr-modal {
    background: #fff;
    border-radius: 14px;
    width: 100%;
    max-width: 560px;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,.16);
    animation: slideUp .2s ease;
  }
  .addr-modal--sm { max-width: 390px; }
  @keyframes slideUp { from { transform: translateY(14px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .addr-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f0f0f0;
  }
  .addr-modal-header h6 { margin: 0; font-size: 1rem; font-weight: 700; }
  .addr-modal-close {
    background: none; border: none; cursor: pointer;
    color: #888; padding: 4px; border-radius: 6px;
    display: flex; transition: color .15s, background .15s;
  }
  .addr-modal-close:hover { color: #222; background: #f5f5f5; }

  /* ── modal form grid ── */
  .addr-modal-body { padding: 18px 22px; }
  .addr-field-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .addr-field { display: flex; flex-direction: column; }
  .addr-field--full { grid-column: 1 / -1; }
  .addr-field label, .addr-field--full label {
    font-size: .78rem;
    font-weight: 600;
    color: #444;
    margin-bottom: 5px;
    display: block;
  }
  .addr-field input,
  .addr-field select {
    padding: 9px 11px;
    border: 1.5px solid #e0e0e0;
    border-radius: 8px;
    font-size: .86rem;
    color: #222;
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
  }
  .addr-field input:focus,
  .addr-field select:focus {
    border-color: #1D9E75;
    box-shadow: 0 0 0 3px rgba(29,158,117,.14);
  }
  .req { color: #d93025; margin-left: 2px; }
  .addr-check {
    display: flex; align-items: center; gap: 8px;
    cursor: pointer; font-size: .83rem; color: #555;
    user-select: none;
  }
  .addr-check input[type=checkbox] {
    width: 15px; height: 15px; accent-color: #1D9E75; cursor: pointer;
  }

  /* ── modal footer ── */
  .addr-modal-footer {
    display: flex; align-items: center; justify-content: flex-end;
    gap: 10px; padding: 14px 22px 18px;
    border-top: 1px solid #f0f0f0;
  }
  .addr-cancel-btn {
    padding: 8px 18px; border-radius: 8px;
    border: 1.5px solid #e0e0e0; background: #fff;
    font-size: .84rem; font-weight: 600; color: #555;
    cursor: pointer; transition: all .15s;
  }
  .addr-cancel-btn:hover { background: #f5f5f5; border-color: #ccc; }

  /* ── delete modal ── */
  .addr-del-body {
    display: flex; flex-direction: column;
    align-items: center; gap: 10px;
    padding: 24px 22px 8px;
    text-align: center;
  }
  .addr-del-body p { font-size: .86rem; color: #555; line-height: 1.6; max-width: 280px; }
  .addr-delete-confirm-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 20px; border-radius: 8px; border: none;
    background: #A32D2D; color: #fff;
    font-size: .84rem; font-weight: 600; cursor: pointer;
    transition: background .15s;
  }
  .addr-delete-confirm-btn:hover:not(:disabled) { background: #791F1F; }
  .addr-delete-confirm-btn:disabled { opacity: .6; cursor: not-allowed; }

  /* ── spinners ── */
  .addr-spinner {
    display: inline-block; width: 28px; height: 28px;
    border: 3px solid rgba(0,0,0,.08); border-top-color: #1D9E75;
    border-radius: 50%; animation: spin .7s linear infinite;
  }
  .addr-spinner-sm {
    display: inline-block; width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,.35); border-top-color: #fff;
    border-radius: 50%; animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── responsive ── */
  @media (max-width: 480px) {
    .addr-card-grid { grid-template-columns: 1fr; }
    .addr-field-grid { grid-template-columns: 1fr; }
    .addr-field--full { grid-column: 1; }
    .addr-modal { border-radius: 10px; }
    .addr-card-top { flex-direction: column; gap: 8px; }
    .addr-badges { flex-direction: row; }
  }
`;
