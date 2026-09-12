import React, { useState, useMemo } from 'react';
import { ColumnDef } from '../../types/transit';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon, ArrowUpDownIcon } from './Icons';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchFilterFields?: (keyof T)[];
  initialSortField?: keyof T | string;
  initialSortOrder?: 'asc' | 'desc';
  pageSize?: number;
  emptyMessage?: string;
  externalSearch?: string;
  onRowClick?: (row: T) => void;
  headerAction?: React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = 'Filter records...',
  searchFilterFields,
  initialSortField,
  initialSortOrder = 'asc',
  pageSize: initialPageSize = 10,
  emptyMessage = 'No records found',
  externalSearch = '',
  onRowClick,
  headerAction,
}: DataTableProps<T>) {
  const [localSearch, setLocalSearch] = useState('');
  const [sortField, setSortField] = useState<string | null>(initialSortField ? String(initialSortField) : null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Combine external search (from global header) and local search
  const effectiveSearch = (externalSearch || localSearch).trim().toLowerCase();

  // Filter
  const filteredData = useMemo(() => {
    if (!effectiveSearch) return data;

    return data.filter((item) => {
      // If specific search fields given, filter on them; else search all string/number fields
      if (searchFilterFields && searchFilterFields.length > 0) {
        return searchFilterFields.some((field) => {
          const val = item[field];
          if (val === null || val === undefined) return false;
          if (Array.isArray(val)) {
            return val.some((v) => String(v).toLowerCase().includes(effectiveSearch));
          }
          return String(val).toLowerCase().includes(effectiveSearch);
        });
      }

      // Default: inspect all item values
      return Object.values(item).some((val) => {
        if (val === null || val === undefined) return false;
        if (Array.isArray(val)) {
          return val.some((v) => String(v).toLowerCase().includes(effectiveSearch));
        }
        return String(val).toLowerCase().includes(effectiveSearch);
      });
    });
  }, [data, effectiveSearch, searchFilterFields]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, validCurrentPage, pageSize]);

  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable === false) return;
    if (sortField === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Table Control Bar */}
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50/50">
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <SearchIcon size={15} />
          </span>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-zinc-400 hover:text-zinc-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-xs text-zinc-500">
            Showing <span className="font-semibold text-zinc-700">{sortedData.length}</span> entries
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/80 text-zinc-500 uppercase tracking-wider font-semibold">
              {columns.map((col) => {
                const isCurrentSort = sortField === String(col.key);
                const isSortable = col.sortable !== false;
                return (
                  <th
                    key={String(col.key)}
                    style={{ width: col.width }}
                    onClick={() => isSortable && handleSort(String(col.key), col.sortable)}
                    className={`py-3 px-4 select-none ${
                      isSortable ? 'cursor-pointer hover:text-zinc-800 hover:bg-zinc-100/70 transition-colors' : ''
                    } ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'center'
                          ? 'justify-center'
                          : col.align === 'right'
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="text-zinc-400">
                          {isCurrentSort ? (
                            sortOrder === 'asc' ? (
                              <ChevronUpIcon size={12} className="text-blue-600" />
                            ) : (
                              <ChevronDownIcon size={12} className="text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDownIcon size={11} className="opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || row.passenger_id || row.route_id || row.station_id || row.trip_id || row.vehicle_id || row.booking_id || row.ticket_id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-blue-50/40' : 'hover:bg-zinc-50/60'
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-4 align-middle ${
                        col.align === 'center'
                          ? 'text-center'
                          : col.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row) : (row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-zinc-400">
                  <p className="text-sm font-medium text-zinc-500">{emptyMessage}</p>
                  <p className="text-xs text-zinc-400 mt-1">Try adjusting your search criteria or adding a new record.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 bg-zinc-50/30">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-zinc-200 rounded px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-zinc-400 pl-1">
            Page {validCurrentPage} of {totalPages}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={validCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-2.5 py-1 border border-zinc-200 rounded bg-white font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // center current page if possible
            let pageNum = i + 1;
            if (totalPages > 5 && validCurrentPage > 3) {
              pageNum = validCurrentPage - 3 + i;
              if (pageNum > totalPages) pageNum = totalPages - (4 - i);
            }
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded font-medium transition-colors ${
                  validCurrentPage === pageNum
                    ? 'bg-zinc-900 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            type="button"
            disabled={validCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-2.5 py-1 border border-zinc-200 rounded bg-white font-medium hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
