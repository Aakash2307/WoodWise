import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getItems, createItem, deleteItem,
  getTransactions, recordMovement,
  logout, getUser,
} from "../../../api";
import Sidebar from "../../../components/Sidebar/Sidebar";
import s from "./Materials.module.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const SofaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="1" y="9" width="16" height="5" rx="1.5" />
    <rect x="3" y="6" width="12" height="3" rx="1" />
    <line x1="4" y1="14" x2="4" y2="17" />
    <line x1="14" y1="14" x2="14" y2="17" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ArrowDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
  </svg>
);
const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── NAV ──────────────────────────────────────────────────────────────────────


// ─── Sidebar ──────────────────────────────────────────────────────────────────


// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className={s.modalBackdrop}>
      <div className={s.confirmModal}>
        <div className={s.confirmIcon}>
          <TrashIcon />
        </div>
        <p className={s.confirmMessage}>{message}</p>
        <div className={s.confirmActions}>
          <button className={s.btnGhost} onClick={onCancel} disabled={loading}>Cancel</button>
          <button className={s.btnDanger} onClick={onConfirm} disabled={loading}>
            {loading ? <span className={s.spinnerSm} /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Drawer ──────────────────────────────────────────────────────────────
function ItemDrawer({ item, categories, onClose, onMovementRecorded }) {
  const [tab, setTab]               = useState("inward");
  const [transactions, setTxns]     = useState([]);
  const [loadingTxns, setLoadingTxns] = useState(false);

  // Movement form
  const [qty, setQty]               = useState("");
  const [ref, setRef]               = useState("");
  const [remarks, setRemarks]       = useState("");
  const [locId, setLocId]           = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [movErr, setMovErr]         = useState("");
  const [movSuccess, setMovSuccess] = useState("");

  const catName = categories.find(c => c.id === item.category_id)?.name ?? "—";

  const fetchTxns = useCallback((type) => {
    setLoadingTxns(true);
    getTransactions({ item_id: item.id, transaction_type: type })
      .then(data => setTxns(data.transactions || []))
      .catch(() => setTxns([]))
      .finally(() => setLoadingTxns(false));
  }, [item.id]);

  useEffect(() => { fetchTxns(tab); }, [tab, fetchTxns]);

  const handleMovement = async () => {
    if (!qty || isNaN(qty) || Number(qty) <= 0) { setMovErr("Enter a valid quantity."); return; }
    setMovErr(""); setMovSuccess(""); setSubmitting(true);
    try {
      const res = await recordMovement({
        item_id: item.id,
        location_id: Number(locId),
        quantity: Number(qty),
        transaction_type: tab,
        reference_number: ref,
        remarks,
      });
      setMovSuccess(`Stock updated! New stock: ${res.new_stock ?? "—"}`);
      setQty(""); setRef(""); setRemarks("");
      fetchTxns(tab);
      onMovementRecorded();
    } catch (e) {
      setMovErr(e?.message || "Failed to record movement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={s.drawerBackdrop} onClick={onClose}>
      <div className={s.drawer} onClick={e => e.stopPropagation()}>
        <div className={s.drawerHeader}>
          <div>
            <h2 className={s.drawerTitle}>{item.name}</h2>
            <span className={s.drawerSub}>SKU: {item.sku} · {catName}</span>
          </div>
          <button className={s.drawerClose} onClick={onClose}><CloseIcon /></button>
        </div>

        {/* Stock pill */}
        <div className={s.stockBanner}>
          <div className={s.stockPill}>
            <PackageIcon />
            <span>Current Stock</span>
            <strong>{item.current_stock ?? 0} {item.unit_of_measure}</strong>
          </div>
          <div className={s.stockMeta}>
            <span>Reorder at <strong>{item.reorder_level}</strong></span>
            <span>Purchase UOM: <strong>{item.purchase_uom}</strong></span>
          </div>
        </div>

        {/* Tabs */}
        <div className={s.drawerTabs}>
          <button className={`${s.drawerTab} ${tab === "inward" ? s.drawerTabActive : ""}`} onClick={() => setTab("inward")}>
            <ArrowDownIcon /> Inward
          </button>
          <button className={`${s.drawerTab} ${tab === "outward" ? s.drawerTabActive : ""}`} onClick={() => setTab("outward")}>
            <ArrowUpIcon /> Outward
          </button>
        </div>

        {/* Record movement */}
        <div className={s.movementForm}>
          <p className={s.movementFormTitle}>Record {tab} movement</p>
          {movErr && <div className={s.errorBox}>{movErr}</div>}
          {movSuccess && <div className={s.successBox}>{movSuccess}</div>}
          <div className={s.movementRow}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Quantity *</label>
              <input className={s.input} type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Location ID</label>
              <input className={s.input} type="number" min="1" value={locId} onChange={e => setLocId(e.target.value)} placeholder="1" />
            </div>
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Reference No.</label>
            <input className={s.input} value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. PO-2026-001" />
          </div>
          <div className={s.fieldGroup}>
            <label className={s.label}>Remarks</label>
            <input className={s.input} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Optional note" />
          </div>
          <button className={s.btnPrimary} onClick={handleMovement} disabled={submitting}>
            {submitting ? <span className={s.spinner} /> : `Record ${tab}`}
          </button>
        </div>

        {/* Transaction log */}
        <div className={s.txnSection}>
          <p className={s.txnTitle}>Transaction history</p>
          {loadingTxns ? (
            <div className={s.txnLoading}>Loading…</div>
          ) : transactions.length === 0 ? (
            <div className={s.txnEmpty}>No {tab} transactions yet.</div>
          ) : (
            <div className={s.txnList}>
              {transactions.map(tx => (
                <div key={tx.id} className={s.txnRow}>
                  <div className={`${s.txnBadge} ${tx.transaction_type === "inward" ? s.txnIn : s.txnOut}`}>
                    {tx.transaction_type === "inward" ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  </div>
                  <div className={s.txnBody}>
                    <span className={s.txnQty}>{tx.quantity} {item.unit_of_measure}</span>
                    <span className={s.txnRef}>{tx.reference_number || "—"}</span>
                    {tx.remarks && <span className={s.txnRemarks}>{tx.remarks}</span>}
                  </div>
                  <div className={s.txnDate}>
                    {new Date(tx.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Item Modal ───────────────────────────────────────────────────────────
function AddItemModal({ categoryId, onClose, onCreated }) {
  const ITEM_TYPES = ["raw_material", "finished_good", "semi_finished", "consumable"];

  const [form, setForm] = useState({
    name: "", sku: "", item_type: "raw_material",
    unit_of_measure: "", purchase_uom: "",
    conversion_ratio: 1, reorder_level: 0,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setErr("Name is required."); return; }
    setErr(""); setLoading(true);
    try {
      const created = await createItem({ ...form, category_id: categoryId });
      onCreated(created);
    } catch (e) {
      setErr(e?.message || "Failed to create item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.modalBackdrop}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>Add Material</h3>
          <button className={s.drawerClose} onClick={onClose}><CloseIcon /></button>
        </div>
        {err && <div className={s.errorBox}>{err}</div>}
        <div className={s.modalBody}>
          <div className={s.fieldGroup}>
            <label className={s.label}>Name *</label>
            <input className={s.input} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. 18mm CenturyPly" />
          </div>
          <div className={s.twoCol}>
            <div className={s.fieldGroup}>
              <label className={s.label}>SKU</label>
              <input className={s.input} value={form.sku} onChange={e => set("sku", e.target.value)} placeholder="AUTO-001" />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Item Type</label>
              <select className={s.input} value={form.item_type} onChange={e => set("item_type", e.target.value)}>
                {ITEM_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
              </select>
            </div>
          </div>
          <div className={s.twoCol}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Unit of Measure</label>
              <input className={s.input} value={form.unit_of_measure} onChange={e => set("unit_of_measure", e.target.value)} placeholder="pcs / kg / m" />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Purchase UOM</label>
              <input className={s.input} value={form.purchase_uom} onChange={e => set("purchase_uom", e.target.value)} placeholder="sheets / bags" />
            </div>
          </div>
          <div className={s.twoCol}>
            <div className={s.fieldGroup}>
              <label className={s.label}>Conversion Ratio</label>
              <input className={s.input} type="number" min="0.01" step="0.01" value={form.conversion_ratio} onChange={e => set("conversion_ratio", Number(e.target.value))} />
            </div>
            <div className={s.fieldGroup}>
              <label className={s.label}>Reorder Level</label>
              <input className={s.input} type="number" min="0" value={form.reorder_level} onChange={e => set("reorder_level", Number(e.target.value))} />
            </div>
          </div>
        </div>
        <div className={s.modalFooter}>
          <button className={s.btnGhost} onClick={onClose} disabled={loading}>Cancel</button>
          <button className={s.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? <span className={s.spinner} /> : "Add Material"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Materials() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Categories state
  const [categories, setCategories]       = useState([]);
  const [loadingCats, setLoadingCats]     = useState(true);
  const [selectedCat, setSelectedCat]     = useState(null);
  const [editingCat, setEditingCat]       = useState(null); // { id, name }
  const [editCatName, setEditCatName]     = useState("");
  const [addingCat, setAddingCat]         = useState(false);
  const [newCatName, setNewCatName]       = useState("");
  const [catLoading, setCatLoading]       = useState(false);
  const [catError, setCatError]           = useState("");
  const [deleteCat, setDeleteCat]         = useState(null); // category to confirm-delete

  // Items state
  const [items, setItems]                 = useState([]);
  const [loadingItems, setLoadingItems]   = useState(false);
  const [showAddItem, setShowAddItem]     = useState(false);
  const [deleteItem_, setDeleteItem_]     = useState(null);
  const [deletingItem, setDeletingItem]   = useState(false);
  const [selectedItem, setSelectedItem]   = useState(null);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    fetchCategories();
  }, []);

  // ── Categories CRUD ──────────────────────────────────────────────────────
  const fetchCategories = () => {
    setLoadingCats(true);
    getCategories()
      .then(data => {
        const cats = Array.isArray(data) ? data : data?.categories ?? [];
        setCategories(cats);
        if (cats.length > 0) setSelectedCat(prev => prev ?? cats[0]);
      })
      .catch(() => setCatError("Failed to load categories."))
      .finally(() => setLoadingCats(false));
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    setCatLoading(true); setCatError("");
    try {
      const created = await createCategory({ name: newCatName.trim() });
      setCategories(prev => [...prev, created]);
      setSelectedCat(created);
      setNewCatName(""); setAddingCat(false);
    } catch { setCatError("Failed to add category."); }
    finally { setCatLoading(false); }
  };

  const handleUpdateCategory = async () => {
    if (!editCatName.trim()) return;
    setCatLoading(true); setCatError("");
    try {
      await updateCategory(editingCat.id, { name: editCatName.trim() });
      setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, name: editCatName.trim() } : c));
      if (selectedCat?.id === editingCat.id) setSelectedCat(prev => ({ ...prev, name: editCatName.trim() }));
      setEditingCat(null); setEditCatName("");
    } catch { setCatError("Failed to update category."); }
    finally { setCatLoading(false); }
  };

  const handleDeleteCategory = async () => {
    setCatLoading(true); setCatError("");
    try {
      await deleteCategory(deleteCat.id);
      const remaining = categories.filter(c => c.id !== deleteCat.id);
      setCategories(remaining);
      if (selectedCat?.id === deleteCat.id) setSelectedCat(remaining[0] ?? null);
      setDeleteCat(null);
    } catch { setCatError("Failed to delete category."); }
    finally { setCatLoading(false); }
  };

  // ── Items ────────────────────────────────────────────────────────────────
  const fetchItems = useCallback((catId) => {
    setLoadingItems(true);
    getItems({ category_id: catId })
      .then(data => setItems(Array.isArray(data) ? data : data?.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoadingItems(false));
  }, []);

  useEffect(() => {
    if (selectedCat) fetchItems(selectedCat.id);
    else setItems([]);
  }, [selectedCat, fetchItems]);

  const handleItemCreated = (item) => {
    setItems(prev => [...prev, item]);
    setShowAddItem(false);
  };

  const handleDeleteItem = async () => {
    setDeletingItem(true);
    try {
      await deleteItem(deleteItem_.id);
      setItems(prev => prev.filter(i => i.id !== deleteItem_.id));
      setDeleteItem_(null);
    } catch { /* silent */ }
    finally { setDeletingItem(false); }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const lowStock = (item) => item.current_stock !== undefined && item.current_stock <= item.reorder_level;

  return (
    <div className={s.layout}>
      <Sidebar user={user} onLogout={handleLogout} />

      <main className={s.main}>
        {/* Topbar */}
        <header className={s.topbar}>
          <div className={s.topbarBreadcrumb}>
            <span className={s.breadcrumbParent} onClick={() => navigate("/factory-admin")}>Dashboard</span>
            <span className={s.breadcrumbSep}>/</span>
            <span className={s.breadcrumbCurrent}>Inventory · Materials</span>
          </div>
          <div className={s.topbarRight}>
            <button className={s.topbarIcon}><BellIcon /></button>
            <div className={s.topbarAvatar}>
              {(user?.full_name || user?.email || "A")[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className={s.content}>
          {/* Page header */}
          <div className={s.pageHeader}>
            <div>
              <h1 className={s.pageTitle}>Materials</h1>
              <p className={s.pageSub}>Manage raw materials, stock levels and movements by category.</p>
            </div>
          </div>

          {catError && <div className={s.errorBox}>{catError}</div>}

          <div className={s.splitLayout}>
            {/* ── Left: Categories panel ── */}
            <div className={s.catPanel}>
              <div className={s.catPanelHeader}>
                <span className={s.catPanelTitle}>Categories</span>
                <button className={s.iconBtn} onClick={() => { setAddingCat(true); setEditingCat(null); }} title="Add category">
                  <PlusIcon />
                </button>
              </div>

              {/* Add category inline */}
              {addingCat && (
                <div className={s.catInlineForm}>
                  <input
                    className={s.catInput}
                    autoFocus
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddCategory(); if (e.key === "Escape") { setAddingCat(false); setNewCatName(""); }}}
                    placeholder="Category name"
                  />
                  <button className={s.iconBtnGreen} onClick={handleAddCategory} disabled={catLoading}><CheckIcon /></button>
                  <button className={s.iconBtnMuted} onClick={() => { setAddingCat(false); setNewCatName(""); }}><XIcon /></button>
                </div>
              )}

              {loadingCats ? (
                <div className={s.catLoading}>
                  {[1,2,3].map(i => <div key={i} className={s.catSkeleton} />)}
                </div>
              ) : categories.length === 0 ? (
                <div className={s.catEmpty}>No categories yet.</div>
              ) : (
                <ul className={s.catList}>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      {editingCat?.id === cat.id ? (
                        <div className={s.catInlineForm}>
                          <input
                            className={s.catInput}
                            autoFocus
                            value={editCatName}
                            onChange={e => setEditCatName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") handleUpdateCategory(); if (e.key === "Escape") setEditingCat(null); }}
                          />
                          <button className={s.iconBtnGreen} onClick={handleUpdateCategory} disabled={catLoading}><CheckIcon /></button>
                          <button className={s.iconBtnMuted} onClick={() => setEditingCat(null)}><XIcon /></button>
                        </div>
                      ) : (
                        <div
                          className={`${s.catItem} ${selectedCat?.id === cat.id ? s.catItemActive : ""}`}
                          onClick={() => setSelectedCat(cat)}
                        >
                          <span className={s.catItemName}>{cat.name}</span>
                          <div className={s.catItemActions}>
                            <button className={s.catActionBtn} onClick={e => { e.stopPropagation(); setEditingCat(cat); setEditCatName(cat.name); }} title="Edit">
                              <EditIcon />
                            </button>
                            <button className={s.catActionBtn} onClick={e => { e.stopPropagation(); setDeleteCat(cat); }} title="Delete">
                              <TrashIcon />
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ── Right: Items panel ── */}
            <div className={s.itemsPanel}>
              {!selectedCat ? (
                <div className={s.itemsEmpty}>
                  <PackageIcon />
                  <p>Select a category to view materials.</p>
                </div>
              ) : (
                <>
                  <div className={s.itemsPanelHeader}>
                    <div>
                      <h2 className={s.itemsPanelTitle}>{selectedCat.name}</h2>
                      <span className={s.itemsCount}>{items.length} item{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <button className={s.btnPrimary} onClick={() => setShowAddItem(true)}>
                      <PlusIcon /> Add Material
                    </button>
                  </div>

                  {loadingItems ? (
                    <div className={s.itemsSkeletonWrap}>
                      {[1,2,3].map(i => <div key={i} className={s.itemSkeleton} />)}
                    </div>
                  ) : items.length === 0 ? (
                    <div className={s.itemsEmpty}>
                      <PackageIcon />
                      <p>No materials in this category yet.</p>
                      <button className={s.btnPrimary} onClick={() => setShowAddItem(true)}>
                        <PlusIcon /> Add first material
                      </button>
                    </div>
                  ) : (
                    <div className={s.itemsTable}>
                      <div className={s.tableHead}>
                        <span>Name</span>
                        <span>SKU</span>
                        <span>Type</span>
                        <span>UOM</span>
                        <span>Stock</span>
                        <span>Reorder</span>
                        <span></span>
                      </div>
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`${s.tableRow} ${lowStock(item) ? s.tableRowLow : ""}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <span className={s.itemName}>{item.name}</span>
                          <span className={s.itemMeta}>{item.sku || "—"}</span>
                          <span className={s.itemType}>{item.item_type?.replace(/_/g, " ") || "—"}</span>
                          <span className={s.itemMeta}>{item.unit_of_measure || "—"}</span>
                          <span className={`${s.stockBadge} ${lowStock(item) ? s.stockLow : s.stockOk}`}>
                            {item.current_stock ?? 0}
                          </span>
                          <span className={s.itemMeta}>{item.reorder_level ?? "—"}</span>
                          <button
                            className={s.rowDeleteBtn}
                            onClick={e => { e.stopPropagation(); setDeleteItem_(item); }}
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Drawers */}
      {deleteCat && (
        <ConfirmModal
          message={`Delete category "${deleteCat.name}"? This cannot be undone.`}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteCat(null)}
          loading={catLoading}
        />
      )}

      {deleteItem_ && (
        <ConfirmModal
          message={`Delete "${deleteItem_.name}"? All stock data will be lost.`}
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteItem_(null)}
          loading={deletingItem}
        />
      )}

      {showAddItem && selectedCat && (
        <AddItemModal
          categoryId={selectedCat.id}
          onClose={() => setShowAddItem(false)}
          onCreated={handleItemCreated}
        />
      )}

      {selectedItem && (
        <ItemDrawer
          item={selectedItem}
          categories={categories}
          onClose={() => setSelectedItem(null)}
          onMovementRecorded={() => fetchItems(selectedCat.id)}
        />
      )}
    </div>
  );
}