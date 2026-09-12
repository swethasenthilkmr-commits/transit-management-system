import React, { useState, useEffect } from 'react';
import { Payment, PaymentMode, PaymentStatus } from '../../types/transit';
import { Modal } from '../common/Modal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Payment) => void;
  initialPayment?: Payment | null;
  existingIds: string[];
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPayment,
  existingIds,
}) => {
  const isEditing = !!initialPayment;

  const [paymentId, setPaymentId] = useState('');
  const [mode, setMode] = useState<PaymentMode>('UPI');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Completed');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialPayment) {
      setPaymentId(initialPayment.payment_id);
      setMode(initialPayment.mode);
      setAmount(String(initialPayment.amount));
      setPaymentDate(initialPayment.payment_date);
      setTxnRef(initialPayment.txn_reference_no);
      setStatus(initialPayment.status);
    } else {
      const numericIds = existingIds
        .map((id) => parseInt(id.replace(/\D/g, ''), 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setPaymentId(`PAY${String(nextNum).padStart(3, '0')}`);
      setMode('UPI');
      setAmount('40.00');
      setPaymentDate('2026-08-20');
      setTxnRef(`TXN${Math.floor(10000000 + Math.random() * 90000000)}`);
      setStatus('Completed');
    }
    setErrors({});
  }, [initialPayment, isOpen, existingIds]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!paymentId.trim()) {
      errs.paymentId = 'Payment ID is required';
    } else if (!isEditing && existingIds.includes(paymentId.trim())) {
      errs.paymentId = 'Payment ID already exists';
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      errs.amount = 'Amount must be a positive number';
    }

    if (!paymentDate) errs.paymentDate = 'Payment date is required';
    if (!txnRef.trim()) errs.txnRef = 'Transaction Reference No is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      payment_id: paymentId.trim().toUpperCase(),
      mode,
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      payment_date: paymentDate,
      txn_reference_no: txnRef.trim().toUpperCase(),
      status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Payment: ${initialPayment?.payment_id}` : 'Process Fare Payment'}
      subtitle="Transit fare collection, payment gateway modes, and transaction references"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Payment ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. PAY001"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-zinc-50 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
            />
            {errors.paymentId && <p className="text-[10px] text-rose-500 mt-0.5">{errors.paymentId}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Payment Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.paymentDate && <p className="text-[10px] text-rose-500 mt-0.5">{errors.paymentDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Payment Mode <span className="text-rose-500">*</span>
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as PaymentMode)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="UPI">UPI (Google Pay / PhonePe)</option>
              <option value="Card">Card (Credit/Debit)</option>
              <option value="Cash">Cash (Counter/Onboard)</option>
              <option value="NetBanking">Net Banking</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Amount ($ / ₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="40.00"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
            {errors.amount && <p className="text-[10px] text-rose-500 mt-0.5">{errors.amount}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-zinc-700 mb-1">
              Transaction Ref No <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={txnRef}
              onChange={(e) => setTxnRef(e.target.value)}
              placeholder="e.g. TXN98765432"
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg font-mono uppercase focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.txnRef && <p className="text-[10px] text-rose-500 mt-0.5">{errors.txnRef}</p>}
          </div>

          <div>
            <label className="block font-medium text-zinc-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaymentStatus)}
              className="w-full px-3 py-1.5 border border-zinc-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-xs"
          >
            {isEditing ? 'Update Payment' : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
