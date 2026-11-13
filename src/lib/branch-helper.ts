import { useSyncExternalStore } from 'react';
import {
  collection as fsCollection,
  doc as fsDoc,
  Firestore,
  CollectionReference,
  DocumentReference,
  DocumentData
} from 'firebase/firestore';

export type BranchId = 'gembong' | 'all' | 'gdm' | 'kedungreja' | 'tehwarga';
export type WarehouseId = 'gembong' | 'gdm' | 'kedungreja';

export interface BranchInfo {
  id: BranchId;
  code: string;
  name: string;
  shortName: string;
  landingRoute: string;
  loginRoute: string;
  badgeColor: string;
}

export interface WarehouseInfo {
  id: WarehouseId;
  code: string;
  name: string;
  shortName: string;
  description: string;
  badgeColor: string;
}

export const WAREHOUSE_LIST: Record<WarehouseId, WarehouseInfo> = {
  gembong: {
    id: 'gembong',
    code: 'GD-GMB',
    name: 'Gudang Utama Gembong',
    shortName: 'Gudang Gembong',
    description: 'Gudang Utama Zona Waktu Gembong (Berdiri Sendiri)',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  gdm: {
    id: 'gdm',
    code: 'GD-GMB',
    name: 'Gudang Utama Gembong',
    shortName: 'Gudang Gembong',
    description: 'Gudang Utama Zona Waktu Gembong',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  kedungreja: {
    id: 'kedungreja',
    code: 'GD-GMB',
    name: 'Gudang Utama Gembong',
    shortName: 'Gudang Gembong',
    description: 'Gudang Utama Zona Waktu Gembong',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  }
};

export const BRANCH_LIST: Record<BranchId, BranchInfo> = {
  gembong: {
    id: 'gembong',
    code: 'ZW-01',
    name: 'Zona Waktu - Cabang Gembong',
    shortName: 'Zona Gembong',
    landingRoute: '/',
    loginRoute: '/owner-login',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  all: {
    id: 'all',
    code: 'ZW-01',
    name: 'Zona Waktu - Cabang Gembong',
    shortName: 'Zona Gembong',
    landingRoute: '/',
    loginRoute: '/owner-login',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  gdm: {
    id: 'gdm',
    code: 'ZW-01',
    name: 'Zona Waktu - Cabang Gembong',
    shortName: 'Zona Gembong',
    landingRoute: '/',
    loginRoute: '/owner-login',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  kedungreja: {
    id: 'kedungreja',
    code: 'ZW-01',
    name: 'Zona Waktu - Cabang Gembong',
    shortName: 'Zona Gembong',
    landingRoute: '/',
    loginRoute: '/owner-login',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  },
  tehwarga: {
    id: 'tehwarga',
    code: 'ZW-01',
    name: 'Zona Waktu - Cabang Gembong',
    shortName: 'Zona Gembong',
    landingRoute: '/',
    loginRoute: '/owner-login',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
  }
};

/**
 * Normalize any branch string to standard BranchId (Defaults to 'gembong')
 */
export function normalizeBranchId(raw: unknown): BranchId {
  if (!raw) return 'gembong';
  const str = String(raw).trim().toLowerCase();
  if (str === 'all') return 'all';
  return 'gembong';
}

/**
 * Get current active branch (Always 'gembong')
 */
export function getActiveBranch(): BranchId {
  if (typeof window === 'undefined') return 'gembong';
  const saved = localStorage.getItem('current_branch');
  if (saved && (saved === 'gembong' || saved === 'all')) return saved as BranchId;
  return 'gembong';
}

function subscribeBranch(callback: () => void) {
  if (typeof window === 'undefined') return () => { };
  window.addEventListener('branch_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('branch_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

/**
 * Hook to reactively listen to active branch changes
 */
export function useActiveBranch(): BranchId {
  return useSyncExternalStore(
    subscribeBranch,
    getActiveBranch,
    () => 'gembong'
  );
}

/**
 * Set current active branch
 */
export function setActiveBranch(branch: BranchId) {
  if (typeof window !== 'undefined') {
    const target = branch === 'all' ? 'all' : 'gembong';
    localStorage.setItem('current_branch', target);
    document.documentElement.setAttribute('data-branch', target);
    window.dispatchEvent(new Event('branch_changed'));
  }
}

/**
 * Get document ID in 'settings' collection for branch business identity
 */
export function getStoreConfigDocId(_explicitBranch?: BranchId): string {
  return 'store_config_gembong';
}

/**
 * Get default store identity per branch
 */
export function getDefaultStoreIdentity(_explicitBranch?: BranchId) {
  return {
    name: "Zona Waktu Gembong",
    tagline: "Coffee & Teh Bakar Cabang Gembong",
    logoLanding: "",
    logoHeader: ""
  };
}

export interface BranchThemeConfig {
  primaryHex: string;
  badgeClass: string;
  activeSidebarClass: string;
  accentTextClass: string;
  groupHoverTextClass: string;
  accentBgClass: string;
  accentBorderClass: string;
  cardHeroGradient: string;
  chartBarColor: string;
  buttonGradient: string;
  dotColor: string;
}

export function getBranchTheme(_branchId?: BranchId): BranchThemeConfig {
  return {
    primaryHex: '#6b3c16',
    badgeClass: 'bg-[#f4e3c9] text-[#532d0f] border-[#d8a86c]/60',
    activeSidebarClass: 'bg-gradient-to-r from-[#2b180c] to-[#462814] text-[#fdfaf5] shadow-lg shadow-[#1e120a]/20 scale-[1.02] border border-[#e6b88a]/25',
    accentTextClass: 'text-[#6b3c16]',
    groupHoverTextClass: 'group-hover:text-[#6b3c16]',
    accentBgClass: 'bg-[#fbf3e6] text-[#532d0f]',
    accentBorderClass: 'border-[#e7c89d]',
    cardHeroGradient: 'bg-gradient-to-r from-[#160c06] via-[#28160b] to-[#3b2212] border-[#e6b88a]/30',
    chartBarColor: '#8b4d20',
    buttonGradient: 'bg-[#2b180c] hover:bg-[#3d2312] text-[#fdfaf5]',
    dotColor: 'bg-[#c48945]'
  };
}

const GLOBAL_COLLECTIONS = new Set(['settings', 'users', 'transfer_requests']);

/**
 * Scope collection name based on current active branch
 * Gembong uses '_gembong' collections
 */
export function getBranchScopedCollectionName(name: string, _explicitBranch?: BranchId): string {
  if (!name) return name;
  if (GLOBAL_COLLECTIONS.has(name)) return name;
  if (name.endsWith('_gembong') || name.endsWith('_gmb')) return name;
  return `${name}_gembong`;
}

/**
 * Branch-scoped collection() helper
 */
export function branchCollection(
  firestoreOrRef: Firestore | DocumentReference,
  path: string,
  explicitBranchOrSegment?: BranchId | string,
  ...pathSegments: string[]
): CollectionReference<DocumentData> {
  const isBranchId = explicitBranchOrSegment === 'all' || explicitBranchOrSegment === 'gdm' || explicitBranchOrSegment === 'kedungreja' || explicitBranchOrSegment === 'tehwarga' || explicitBranchOrSegment === 'gembong';
  const branch = isBranchId ? (explicitBranchOrSegment as BranchId) : undefined;
  const remainingSegments = isBranchId ? pathSegments : (explicitBranchOrSegment ? [explicitBranchOrSegment, ...pathSegments] : []);

  const scopedPath = getBranchScopedCollectionName(path, branch);
  if (remainingSegments.length > 0) {
    return fsCollection(firestoreOrRef as Firestore, scopedPath, ...remainingSegments);
  }
  return fsCollection(firestoreOrRef as Firestore, scopedPath);
}

/**
 * Branch-scoped doc() helper
 * Supports:
 * - branchDoc(db, "bahan-baku", "item123", "gembong")
 * - branchDoc(db, "bahan-baku/item123", "gembong")
 * - branchDoc(colRef)
 */
export function branchDoc(
  firestoreOrRefOrCol: Firestore | CollectionReference | DocumentReference,
  path?: string,
  idOrBranch?: string | BranchId,
  explicitBranch?: BranchId,
  ...pathSegments: string[]
): DocumentReference<DocumentData> {
  // If called without path (e.g. doc(collectionRef) for generating an auto ID)
  if (path === undefined) {
    return fsDoc(firestoreOrRefOrCol as CollectionReference<DocumentData>);
  }

  // Check if second param is docId or branchId
  const isBranchId = idOrBranch === 'all' || idOrBranch === 'gdm' || idOrBranch === 'kedungreja' || idOrBranch === 'tehwarga' || idOrBranch === 'gembong';

  // If path is a string
  if (typeof path === 'string') {
    const parts = path.split('/');
    const targetBranch = isBranchId ? (idOrBranch as BranchId) : explicitBranch;
    parts[0] = getBranchScopedCollectionName(parts[0], targetBranch);

    if (!isBranchId && idOrBranch) {
      parts.push(idOrBranch);
    }
    if (pathSegments.length > 0) {
      parts.push(...pathSegments);
    }

    const fullPath = parts.join('/');
    return fsDoc(firestoreOrRefOrCol as Firestore, fullPath);
  }

  return fsDoc(firestoreOrRefOrCol as Firestore, path, ...pathSegments);
}

/**
 * Map any branch to its parent physical warehouse (Gembong)
 */
export function getWarehouseForBranch(_branchId?: BranchId): WarehouseId {
  return 'gembong';
}

/**
 * Scope collection specifically for Gudang Utama operations:
 * Defaults to '_gembong' collections (e.g. 'bahan-baku_gembong', 'log_pembelian_bahan_gembong', 'opnam_gudang_gembong')
 */
export function getWarehouseScopedCollectionName(name: string, _explicitWarehouse?: WarehouseId): string {
  if (!name) return name;
  if (GLOBAL_COLLECTIONS.has(name)) return name;
  if (name.endsWith('_gembong') || name.endsWith('_gmb')) return name;
  return `${name}_gembong`;
}

/**
 * Warehouse-scoped collection() helper
 */
export function warehouseCollection(
  firestoreOrRef: Firestore | DocumentReference,
  path: string,
  explicitWarehouse?: WarehouseId,
  ...pathSegments: string[]
): CollectionReference<DocumentData> {
  const scopedPath = getWarehouseScopedCollectionName(path, explicitWarehouse);
  if (pathSegments.length > 0) {
    return fsCollection(firestoreOrRef as Firestore, scopedPath, ...pathSegments);
  }
  return fsCollection(firestoreOrRef as Firestore, scopedPath);
}

/**
 * Warehouse-scoped doc() helper
 */
export function warehouseDoc(
  firestoreOrRefOrCol: Firestore | CollectionReference | DocumentReference,
  path?: string,
  idOrWarehouse?: string | WarehouseId,
  explicitWarehouse?: WarehouseId,
  ...pathSegments: string[]
): DocumentReference<DocumentData> {
  if (path === undefined) {
    return fsDoc(firestoreOrRefOrCol as CollectionReference<DocumentData>);
  }

  const isWarehouseId = idOrWarehouse === 'gdm' || idOrWarehouse === 'kedungreja' || idOrWarehouse === 'gembong';

  if (typeof path === 'string') {
    const parts = path.split('/');
    const targetWarehouse = isWarehouseId ? (idOrWarehouse as WarehouseId) : explicitWarehouse;
    parts[0] = getWarehouseScopedCollectionName(parts[0], targetWarehouse);

    if (!isWarehouseId && idOrWarehouse) {
      parts.push(idOrWarehouse);
    }
    if (pathSegments.length > 0) {
      parts.push(...pathSegments);
    }

    const fullPath = parts.join('/');
    return fsDoc(firestoreOrRefOrCol as Firestore, fullPath);
  }

  return fsDoc(firestoreOrRefOrCol as Firestore, path, ...pathSegments);
}

/**
 * Check if a material belongs to the Gembong container/outlet.
 */
export function isMaterialForBranchContainer(
  _item: { code?: string; isFromTehWarga?: boolean; originalTwCode?: string; _branchId?: string;[key: string]: unknown },
  _branch?: BranchId
): boolean {
  return true;
}

/**
 * Filter an array of materials to only include materials belonging to Gembong.
 */
export function filterContainerMaterials<T extends { code?: string; isFromTehWarga?: boolean; originalTwCode?: string }>(
  materials: T[] | null | undefined,
  _branch?: BranchId
): T[] {
  if (!materials || !Array.isArray(materials)) return [];
  return materials;
}

