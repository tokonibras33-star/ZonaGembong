'use client';

import { useEffect, useState, useMemo, DependencyList } from 'react';
import {
  Query,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  FirestoreError,
  Firestore,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';
import { 
  useActiveBranch, 
  branchCollection, 
  warehouseCollection, 
  BranchId,
  WarehouseId 
} from '@/lib/branch-helper';

export const useCollection = <T = DocumentData>(query: Query<T> | null) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset state saat query berubah untuk menghindari data lama (ghosting)
    queueMicrotask(() => {
      setData([]);
      setLoading(true);
      setError(null);
    });

    if (!query) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as T & { id: string }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (serverError: FirestoreError) => {
        setLoading(false);
        setError(serverError);
        
        if (serverError.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: 'koleksi-terproteksi',
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
        }
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error };
};

/**
 * Hook untuk melakukan query reaktif ke data toko Gembong.
 */
export function useConsolidatedCollection<T = DocumentData>(
  firestore: Firestore,
  collectionName: string,
  queryBuilder?: (col: CollectionReference<DocumentData>, branch: BranchId) => Query<DocumentData> | CollectionReference<DocumentData>,
  deps: DependencyList = []
) {
  const activeBranch = useActiveBranch();

  const qGmb = useMemo(() => {
    if (!firestore) return null;
    const col = branchCollection(firestore, collectionName, 'gembong');
    return queryBuilder ? queryBuilder(col, 'gembong') : col;
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, [firestore, collectionName, activeBranch, ...deps]);

  const resGmb = useCollection(qGmb);

  const data = useMemo(() => {
    return (resGmb.data || []).map(it => ({ ...it, _branchId: 'gembong', _branchName: 'Zona Gembong' }));
  }, [resGmb.data]);

  return { data: data as T[], loading: resGmb.loading, error: resGmb.error };
}

/**
 * Hook untuk melakukan query reaktif ke Gudang Utama Gembong.
 */
export function useConsolidatedWarehouseCollection<T = DocumentData>(
  firestore: Firestore,
  collectionName: string,
  queryBuilder?: (col: CollectionReference<DocumentData>, whId: WarehouseId) => Query<DocumentData> | CollectionReference<DocumentData>,
  deps: DependencyList = []
) {
  const activeBranch = useActiveBranch();

  const qWhGmb = useMemo(() => {
    if (!firestore) return null;
    const col = warehouseCollection(firestore, collectionName, 'gembong');
    return queryBuilder ? queryBuilder(col, 'gembong') : col;
    // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  }, [firestore, collectionName, activeBranch, ...deps]);

  const resWhGmb = useCollection(qWhGmb);

  const data = useMemo(() => {
    return (resWhGmb.data || []).map(it => ({ ...it, _warehouseId: 'gembong', _warehouseName: 'Gudang Utama Gembong' }));
  }, [resWhGmb.data]);

  return { data: data as T[], loading: resWhGmb.loading, error: resWhGmb.error };
}
