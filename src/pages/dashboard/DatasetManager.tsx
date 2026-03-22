import React, { useState, useEffect } from 'react';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowUpTray,
  HiOutlineCircleStack,
  HiOutlineEllipsisVertical,
  HiOutlineTrash,
  HiOutlineArrowDownTray,
  HiOutlineEye,
  HiOutlineFunnel,
  HiOutlinePlus,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import { mockDatasets } from '../../data/mockData';
import { datasetService } from '../../api';
import Modal from '../../components/ui/Modal';
import type { DatasetItem } from '../../types';

const DatasetManager: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<DatasetItem[]>(mockDatasets);

  useEffect(() => {
    datasetService.list({ page: 1, pageSize: 50 }).then((data) => {
      setDatasets(data.items.map((ds) => ({
        id: ds.id, name: ds.name, size: ds.size,
        images: ds.images, annotations: ds.annotations,
        uploadDate: ds.uploadDate, status: ds.status as any, format: ds.format,
      })));
    }).catch(() => { /* use mock fallback */ });
  }, []);

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = filterFormat === 'all' || ds.format === filterFormat;
    return matchesSearch && matchesFormat;
  });

  const statusConfig: Record<string, { icon: React.ReactNode; class: string }> = {
    ready: { icon: <HiOutlineCheckCircle className="w-3.5 h-3.5" />, class: 'bg-green-100 text-green-700' },
    processing: { icon: <HiOutlineClock className="w-3.5 h-3.5" />, class: 'bg-blue-100 text-blue-700' },
    error: { icon: <HiOutlineExclamationCircle className="w-3.5 h-3.5" />, class: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dataset Manager</h1>
          <p className="text-gray-500 mt-1">Manage training datasets for the tumor detection model.</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Upload Dataset
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="all">All Formats</option>
              <option value="YOLO">YOLO</option>
              <option value="COCO">COCO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <HiOutlineCircleStack className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{mockDatasets.length}</p>
              <p className="text-xs text-gray-500">Total Datasets</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <HiOutlineCheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDatasets.reduce((a, d) => a + d.images, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Images</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <HiOutlineArrowUpTray className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {mockDatasets.reduce((a, d) => a + d.annotations, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Total Annotations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Dataset
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Format
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Images
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Size
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Uploaded
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map((ds) => (
                <tr key={ds.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                        <HiOutlineCircleStack className="w-4 h-4 text-primary-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ds.name}</p>
                        <p className="text-xs text-gray-400">{ds.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
                      {ds.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {ds.images.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ds.size}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusConfig[ds.status].class}`}
                    >
                      {statusConfig[ds.status].icon}
                      {ds.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{ds.uploadDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setActiveMenu(activeMenu === ds.id ? null : ds.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <HiOutlineEllipsisVertical className="w-4 h-4" />
                      </button>
                      {activeMenu === ds.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-modal z-10 py-1 animate-fade-in">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <HiOutlineEye className="w-3.5 h-3.5" /> Preview
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <HiOutlineArrowDownTray className="w-3.5 h-3.5" /> Download
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <HiOutlineTrash className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDatasets.length === 0 && (
          <div className="py-12 text-center">
            <HiOutlineCircleStack className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No datasets found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Dataset">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Dataset Name</label>
            <input
              type="text"
              placeholder="e.g. Brain Tumor MRI Dataset v4"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Annotation Format</label>
            <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
              <option value="YOLO">YOLO Format</option>
              <option value="COCO">COCO Format</option>
              <option value="VOC">Pascal VOC</option>
            </select>
          </div>
          <div className="drop-zone p-8 text-center cursor-pointer">
            <HiOutlineArrowUpTray className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Drop dataset archive here</p>
            <p className="text-xs text-gray-400 mt-1">ZIP or TAR.GZ • Max 10GB</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25">
              Upload
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatasetManager;
