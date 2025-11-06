import { BorrowRequest } from './mockData';

const BASE = 'http://localhost:8080/requests';

export async function listRequestsLive(): Promise<BorrowRequest[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch requests');
  return res.json();
}

export async function createRequestLive(body: Partial<BorrowRequest>): Promise<BorrowRequest> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create request');
  return res.json();
}

export async function getRequestByIdLive(id: string): Promise<BorrowRequest> {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch request');
  return res.json();
}

export async function updateRequestStatusLive(id: string, payload: { status: string; approvedBy?: string; }): Promise<BorrowRequest> {
  const res = await fetch(`${BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

// Simple fallback mock helpers that operate on localStorage
export function listRequestsMock(): BorrowRequest[] {
  const stored = localStorage.getItem('requests');
  return stored ? JSON.parse(stored) : [];
}

export function createRequestMock(r: BorrowRequest): BorrowRequest {
  const existing = listRequestsMock();
  const updated = [...existing, r];
  localStorage.setItem('requests', JSON.stringify(updated));
  return r;
}

export function updateRequestStatusMock(id: string, updater: Partial<BorrowRequest>) {
  const existing = listRequestsMock();
  const updated = existing.map(r => r.id === id ? { ...r, ...updater } : r);
  localStorage.setItem('requests', JSON.stringify(updated));
  return updated.find(r => r.id === id);
}
