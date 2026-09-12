import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Payment, ColumnDef } from '../../types/transit';
import { DataTable } from '../common/DataTable';
import { PaymentModal } from './PaymentModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { StatusBadge, Badge } from '../common/Badge';
import { PlusIcon, EditIcon, TrashIcon, PaymentIcon } from '../common/Icons';

export const PaymentList: React.FC = () => {
  const { payments, addPayment, updatePayment, deletePayment, globalSearch } = useTransit();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleOpenAdd = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handlePromptDelete = (payment: Payment) => {
    setDeleteTarget(payment);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePayment(deleteTarget.payment_id);
      setDeleteTarget(null);
    }
  };

  const handleSave = (payment: Payment) => {
    if (editingPayment) {
      updatePayment(payment);
    } else {
      addPayment(payment);
    }
  };

  const columns: ColumnDef<Payment>[] = [
    {
      key: 'payment_id',
      header: 'Payment ID',
      width: '100px',
      render: (row) => (
        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-xs">
          {row.payment_id}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount Collected',
      align: 'right',
      width: '130px',
      render: (row) => (
        <span className="font-mono font-bold text-sm text-emerald-700">
          ${row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'mode',
      header: 'Payment Channel / Mode',
      width: '140px',
      render: (row) => {
        let variant: 'bus' | 'metro' | 'success' | 'neutral' = 'neutral';
        if (row.mode === 'UPI') variant = 'metro';
        else if (row.mode === 'Card') variant = 'bus';
        else if (row.mode === 'Cash') variant = 'success';
        return <Badge variant={variant}>{row.mode}</Badge>;
      },
    },
    {
      key: 'txn_reference_no',
      header: 'Transaction Reference No',
      render: (row) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-800">
          <PaymentIcon size={13} className="text-zinc-400" />
          <span className="font-semibold">{row.txn_reference_no}</span>
        </div>
      ),
    },
    {
      key: 'payment_date',
      header: 'Transaction Date',
      width: '120px',
      render: (row) => (
        <span className="text-zinc-600 font-mono text-[11px]">{row.payment_date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '110px',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      sortable: false,
      width: '100px',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(row);
            }}
            title="Edit Payment"
            className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <EditIcon size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePromptDelete(row);
            }}
            title="Delete Payment"
            className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <TrashIcon size={15} />
          </button>
        </div>
      ),
    },
  ];

  const totalCollected = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200">
        <div>
          <h2 className="text-sm font-bold text-zinc-900">Payment Transactions</h2>
          <p className="text-xs text-zinc-500">
            Fare receipts, transaction references, and payment gateway settlement records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-zinc-400 block uppercase">Settled Revenue</span>
            <span className="text-sm font-mono font-bold text-emerald-700">
              ${totalCollected.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
          >
            <PlusIcon size={14} /> Record Payment
          </button>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        externalSearch={globalSearch}
        searchPlaceholder="Filter payments by ID, reference, mode, date..."
        initialSortField="payment_id"
        initialSortOrder="asc"
        emptyMessage="No payment records found"
      />

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialPayment={editingPayment}
        existingIds={payments.map((p) => p.payment_id)}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Record"
        message={`Are you sure you want to delete payment ${deleteTarget?.payment_id} (${deleteTarget?.txn_reference_no}) for $${deleteTarget?.amount.toFixed(2)}?`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
