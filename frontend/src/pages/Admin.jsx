import React, { useEffect, useState } from "react";
import {
    adminFetchProducts,
    adminCreateProduct,
    adminUpdateProduct,
    adminDeleteProduct,
} from "@/lib/api";

const SESSION_KEY = "sl_admin_pw";

const EMPTY_FORM = {
    name: "",
    category: "",
    price: "",
    link: "",
    media_urls: "",
    description: "",
    store_name: "",
    city: "",
    date_acquired: "",
    featured: false,
    tags: "",
};

function productToForm(p) {
    return {
        name: p.name || "",
        category: p.category || "",
        price: p.price || "",
        link: p.link || "",
        media_urls: (p.media_urls || []).join("\n"),
        description: p.description || "",
        store_name: p.store_name || "",
        city: p.city || "",
        date_acquired: p.date_acquired || "",
        featured: p.featured || false,
        tags: (p.tags || []).join(", "),
    };
}

function formToProduct(f) {
    return {
        name: f.name.trim(),
        category: f.category.trim() || "Uncategorized",
        price: f.price.trim(),
        link: f.link.trim(),
        media_urls: f.media_urls
            .split("\n")
            .map((u) => u.trim())
            .filter(Boolean),
        description: f.description.trim(),
        store_name: f.store_name.trim(),
        city: f.city.trim(),
        date_acquired: f.date_acquired.trim(),
        featured: f.featured,
        tags: f.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
    };
}

const Admin = () => {
    const [pw, setPw] = useState("");
    const [authed, setAuthed] = useState(false);
    const [storedPw, setStoredPw] = useState(sessionStorage.getItem(SESSION_KEY) || "");
    const [products, setProducts] = useState([]);
    const [loadErr, setLoadErr] = useState("");
    const [loginErr, setLoginErr] = useState("");
    const [form, setForm] = useState(null); // null = closed, EMPTY_FORM = new, {...} = editing
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formErr, setFormErr] = useState("");
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (storedPw) tryLoad(storedPw);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function tryLoad(password) {
        setLoadErr("");
        try {
            const data = await adminFetchProducts(password);
            setProducts(data);
            setAuthed(true);
            sessionStorage.setItem(SESSION_KEY, password);
            setStoredPw(password);
        } catch {
            setAuthed(false);
            sessionStorage.removeItem(SESSION_KEY);
            setLoginErr("Wrong password.");
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginErr("");
        tryLoad(pw);
    };

    const logout = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthed(false);
        setStoredPw("");
        setPw("");
        setProducts([]);
    };

    const openAdd = () => {
        setEditId(null);
        setForm(EMPTY_FORM);
        setFormErr("");
    };

    const openEdit = (p) => {
        setEditId(p.id);
        setForm(productToForm(p));
        setFormErr("");
    };

    const closeForm = () => {
        setForm(null);
        setEditId(null);
        setFormErr("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { setFormErr("Name is required."); return; }
        setSaving(true);
        setFormErr("");
        try {
            const payload = formToProduct(form);
            if (editId) {
                const updated = await adminUpdateProduct(storedPw, editId, payload);
                setProducts((prev) => prev.map((p) => (p.id === editId ? updated : p)));
            } else {
                const created = await adminCreateProduct(storedPw, payload);
                setProducts((prev) => [...prev, created]);
            }
            closeForm();
        } catch (err) {
            setFormErr(err?.response?.data?.detail || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleting(id);
        try {
            await adminDeleteProduct(storedPw, id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            setLoadErr("Delete failed.");
        } finally {
            setDeleting(null);
        }
    };

    if (!authed) {
        return (
            <div className="min-h-screen bg-[#F7F7F7] grid place-items-center px-4">
                <div className="w-full max-w-sm">
                    <div className="font-display text-3xl mb-1 tracking-tight">Admin</div>
                    <div className="meta-label mb-8">Suitcase & Life</div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={pw}
                            onChange={(e) => setPw(e.target.value)}
                            placeholder="Password"
                            autoFocus
                            className="w-full border border-black/10 rounded-2xl px-4 py-3 text-sm bg-white outline-none focus:border-black/30 font-instr-sans"
                        />
                        {loginErr && <p className="text-red-500 text-sm">{loginErr}</p>}
                        <button
                            type="submit"
                            className="w-full bg-[#0A0A0A] text-white rounded-full py-3.5 text-sm font-medium font-instr-sans"
                        >
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F7F7]">
            {/* Top bar */}
            <div className="sticky top-0 z-10 bg-white border-b border-black/[0.06] px-6 py-4 flex items-center justify-between">
                <div className="font-display text-xl tracking-tight">Admin</div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openAdd}
                        className="bg-[#0A0A0A] text-white rounded-full px-5 py-2 text-sm font-medium font-instr-sans"
                    >
                        + Add Product
                    </button>
                    <button
                        onClick={logout}
                        className="text-sm text-neutral-500 hover:text-neutral-900 font-instr-sans"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Product list */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {loadErr && <p className="text-red-500 text-sm mb-4">{loadErr}</p>}
                {products.length === 0 ? (
                    <div className="text-center py-24 text-neutral-400 font-instr-sans">
                        No products yet. Add your first one.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 border border-black/[0.06]"
                            >
                                {p.media_urls?.[0] ? (
                                    <img
                                        src={p.media_urls[0]}
                                        alt={p.name}
                                        className="w-14 h-14 rounded-xl object-cover shrink-0 bg-neutral-100"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-neutral-100 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{p.name}</div>
                                    <div className="meta-label mt-0.5">{p.category} · {p.price || "—"}</div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="text-sm text-neutral-500 hover:text-neutral-900 border border-black/10 rounded-full px-4 py-1.5 font-instr-sans"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        disabled={deleting === p.id}
                                        className="text-sm text-red-500 hover:text-red-700 border border-red-100 rounded-full px-4 py-1.5 font-instr-sans disabled:opacity-40"
                                    >
                                        {deleting === p.id ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Product form modal */}
            {form !== null && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
                    <div className="bg-white w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06] shrink-0">
                            <div className="font-display text-xl tracking-tight">
                                {editId ? "Edit Product" : "Add Product"}
                            </div>
                            <button
                                onClick={closeForm}
                                className="w-8 h-8 rounded-full bg-black/5 grid place-items-center text-sm"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                            <Field label="Name *">
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Braun BN0032"
                                    className={inputCls}
                                    autoFocus
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Category">
                                    <input
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        placeholder="Electronics"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Price">
                                    <input
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="$180"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <Field label="Buy Link">
                                <input
                                    value={form.link}
                                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                                    placeholder="https://..."
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Image URLs (one per line)">
                                <textarea
                                    value={form.media_urls}
                                    onChange={(e) => setForm({ ...form, media_urls: e.target.value })}
                                    placeholder={"https://res.cloudinary.com/.../photo1.jpg\nhttps://res.cloudinary.com/.../photo2.jpg"}
                                    rows={4}
                                    className={inputCls + " resize-none"}
                                />
                            </Field>
                            <Field label="Description">
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="The story behind this object..."
                                    rows={3}
                                    className={inputCls + " resize-none"}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Store Name">
                                    <input
                                        value={form.store_name}
                                        onChange={(e) => setForm({ ...form, store_name: e.target.value })}
                                        placeholder="Nordgreen Flagship"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="City">
                                    <input
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        placeholder="Tokyo"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Date Acquired">
                                    <input
                                        value={form.date_acquired}
                                        onChange={(e) => setForm({ ...form, date_acquired: e.target.value })}
                                        placeholder="Jan 2024"
                                        className={inputCls}
                                    />
                                </Field>
                                <Field label="Tags (comma-separated)">
                                    <input
                                        value={form.tags}
                                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                                        placeholder="Minimal, Japan, Design"
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.featured}
                                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                                    className="w-4 h-4 rounded"
                                />
                                <span className="text-sm font-instr-sans">Featured (show in highlights)</span>
                            </label>
                            {formErr && <p className="text-red-500 text-sm">{formErr}</p>}
                        </form>
                        <div className="px-6 pb-6 pt-4 border-t border-black/[0.06] shrink-0">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-[#0A0A0A] text-white rounded-full py-3.5 text-sm font-medium font-instr-sans disabled:opacity-50"
                            >
                                {saving ? "Saving…" : editId ? "Save Changes" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const inputCls =
    "w-full border border-black/10 rounded-xl px-3.5 py-2.5 text-sm bg-[#F7F7F7] outline-none focus:border-black/30 font-instr-sans";

const Field = ({ label, children }) => (
    <div>
        <label className="meta-label mb-1.5 block">{label}</label>
        {children}
    </div>
);

export default Admin;
