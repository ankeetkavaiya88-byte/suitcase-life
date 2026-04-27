import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export async function fetchProducts() {
    const { data } = await axios.get(`${API}/products`);
    return data;
}

export async function fetchCategories() {
    const { data } = await axios.get(`${API}/categories`);
    return data;
}

export async function likeProduct(productId) {
    const { data } = await axios.post(`${API}/products/${productId}/like`);
    return data;
}

const LIKED_KEY = "sl_liked_v1";

export function getLikedSet() {
    try {
        const raw = localStorage.getItem(LIKED_KEY);
        return new Set(raw ? JSON.parse(raw) : []);
    } catch {
        return new Set();
    }
}

export function addLiked(id) {
    const s = getLikedSet();
    s.add(id);
    localStorage.setItem(LIKED_KEY, JSON.stringify([...s]));
    return s;
}

function adminHeaders(password) {
    return { "x-admin-password": password };
}

export async function adminFetchProducts(password) {
    const { data } = await axios.get(`${API}/admin/products`, { headers: adminHeaders(password) });
    return data;
}

export async function adminCreateProduct(password, product) {
    const { data } = await axios.post(`${API}/admin/products`, product, { headers: adminHeaders(password) });
    return data;
}

export async function adminUpdateProduct(password, id, product) {
    const { data } = await axios.put(`${API}/admin/products/${id}`, product, { headers: adminHeaders(password) });
    return data;
}

export async function adminDeleteProduct(password, id) {
    await axios.delete(`${API}/admin/products/${id}`, { headers: adminHeaders(password) });
}
