import React, { useState, useEffect } from 'react';
import {
  HiOutlineFolderOpen,
  HiOutlineFolder,
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineCalendarDays,
  HiOutlineHeart,
  HiOutlineBeaker,
  HiOutlineScale,
  HiOutlineArrowsUpDown,
  HiOutlineExclamationCircle,
  HiOutlineSignal,
  HiOutlineDocumentText,
  HiOutlineChevronRight,
  HiOutlineXMark,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlinePrinter,
  HiOutlineArrowDownTray,
  HiOutlineFunnel,
  HiOutlinePlus,
  HiOutlineBarsArrowUp,
  HiOutlineUserGroup,
  HiOutlineArrowUpRight,
} from 'react-icons/hi2';
import { LuBrain } from 'react-icons/lu';
import { patientService } from '../../api';
import Modal from '../../components/ui/Modal';

// ─── Patient Type ────────────────────────────────────────
interface Patient {
  id: string;
  fileNo: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  emergencyContact: { name: string; relation: string; phone: string };
  height: string;
  weight: string;
  bmi: number;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  primaryPhysician: string;
  registrationDate: string;
  lastVisit: string;
  status: 'active' | 'discharged' | 'referred';
  insuranceProvider: string;
  insuranceId: string;
  mriScans: number;
  diagnosis: string;
  notes: string;
}

// ─── Mock Patient Data ───────────────────────────────────
const patients: Patient[] = [
  {
    id: 'P-10482',
    fileNo: 'NRO-2026-0482',
    firstName: 'John',
    lastName: 'Anderson',
    dateOfBirth: '1978-03-14',
    age: 47,
    gender: 'Male',
    bloodType: 'O+',
    phone: '+1 (555) 234-8901',
    email: 'john.anderson@email.com',
    address: '142 Maple Drive',
    city: 'Boston, MA 02108',
    emergencyContact: { name: 'Sarah Anderson', relation: 'Spouse', phone: '+1 (555) 234-8902' },
    height: '5\'11"',
    weight: '185 lbs',
    bmi: 25.8,
    allergies: ['Penicillin', 'Latex'],
    chronicConditions: ['Hypertension'],
    medications: ['Lisinopril 10mg', 'Aspirin 81mg'],
    primaryPhysician: 'Dr. Sarah Chen',
    registrationDate: '2025-09-12',
    lastVisit: '2026-02-26',
    status: 'active',
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS-449821',
    mriScans: 3,
    diagnosis: 'Glioma — Left Temporal Lobe',
    notes: 'Patient referred for follow-up MRI after initial detection. Scheduled for biopsy consultation.',
  },
  {
    id: 'P-10483',
    fileNo: 'NRO-2026-0483',
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1985-07-22',
    age: 40,
    gender: 'Female',
    bloodType: 'A+',
    phone: '+1 (555) 876-5432',
    email: 'maria.garcia@email.com',
    address: '78 Oak Street, Apt 4B',
    city: 'Cambridge, MA 02139',
    emergencyContact: { name: 'Carlos Garcia', relation: 'Brother', phone: '+1 (555) 876-5433' },
    height: '5\'6"',
    weight: '142 lbs',
    bmi: 22.9,
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Migraine'],
    medications: ['Sumatriptan 50mg PRN'],
    primaryPhysician: 'Dr. Sarah Chen',
    registrationDate: '2026-01-05',
    lastVisit: '2026-02-26',
    status: 'active',
    insuranceProvider: 'Aetna',
    insuranceId: 'AET-221045',
    mriScans: 2,
    diagnosis: 'No tumor detected — Routine follow-up',
    notes: 'Recurring migraines prompted MRI screening. Results clear. Follow-up in 6 months.',
  },
  {
    id: 'P-10484',
    fileNo: 'NRO-2026-0484',
    firstName: 'Robert',
    lastName: 'Lee',
    dateOfBirth: '1962-11-08',
    age: 63,
    gender: 'Male',
    bloodType: 'B-',
    phone: '+1 (555) 345-6789',
    email: 'robert.lee@email.com',
    address: '305 Elm Avenue',
    city: 'Brookline, MA 02445',
    emergencyContact: { name: 'Linda Lee', relation: 'Spouse', phone: '+1 (555) 345-6790' },
    height: '5\'9"',
    weight: '172 lbs',
    bmi: 25.4,
    allergies: [],
    chronicConditions: ['Type 2 Diabetes', 'Hyperlipidemia'],
    medications: ['Metformin 500mg', 'Atorvastatin 20mg', 'Dexamethasone 4mg'],
    primaryPhysician: 'Dr. Emily Park',
    registrationDate: '2025-06-20',
    lastVisit: '2026-02-25',
    status: 'active',
    insuranceProvider: 'Medicare',
    insuranceId: 'MCR-8812934',
    mriScans: 5,
    diagnosis: 'Meningioma — Right Frontal Lobe',
    notes: 'Under observation. Tumor stable, no growth in last 3 scans. Continue monitoring every 8 weeks.',
  },
  {
    id: 'P-10485',
    fileNo: 'NRO-2026-0485',
    firstName: 'Lisa',
    lastName: 'Thompson',
    dateOfBirth: '1990-01-30',
    age: 36,
    gender: 'Female',
    bloodType: 'AB+',
    phone: '+1 (555) 567-1234',
    email: 'lisa.thompson@email.com',
    address: '22 Beacon Hill Road',
    city: 'Boston, MA 02114',
    emergencyContact: { name: 'Mark Thompson', relation: 'Spouse', phone: '+1 (555) 567-1235' },
    height: '5\'4"',
    weight: '128 lbs',
    bmi: 22.0,
    allergies: ['Iodine contrast dye'],
    chronicConditions: [],
    medications: ['Cabergoline 0.5mg'],
    primaryPhysician: 'Dr. Sarah Chen',
    registrationDate: '2025-12-01',
    lastVisit: '2026-02-25',
    status: 'active',
    insuranceProvider: 'UnitedHealthcare',
    insuranceId: 'UHC-667234',
    mriScans: 4,
    diagnosis: 'Pituitary Adenoma — Sella Turcica',
    notes: 'Hormone levels stabilizing with medication. MRI shows slight reduction in tumor size.',
  },
  {
    id: 'P-10486',
    fileNo: 'NRO-2026-0486',
    firstName: 'David',
    lastName: 'Wilson',
    dateOfBirth: '1955-05-17',
    age: 70,
    gender: 'Male',
    bloodType: 'A-',
    phone: '+1 (555) 789-4561',
    email: 'david.wilson@email.com',
    address: '890 Commonwealth Ave',
    city: 'Boston, MA 02215',
    emergencyContact: { name: 'James Wilson', relation: 'Son', phone: '+1 (555) 789-4562' },
    height: '5\'10"',
    weight: '168 lbs',
    bmi: 24.1,
    allergies: ['Aspirin', 'Codeine'],
    chronicConditions: ['Atrial Fibrillation', 'Osteoarthritis'],
    medications: ['Warfarin 5mg', 'Acetaminophen 500mg PRN'],
    primaryPhysician: 'Dr. Alexander Reid',
    registrationDate: '2024-11-15',
    lastVisit: '2026-02-24',
    status: 'active',
    insuranceProvider: 'Medicare',
    insuranceId: 'MCR-5578122',
    mriScans: 1,
    diagnosis: 'Pending — Scan processing',
    notes: 'Initial MRI scan submitted. Awaiting AI analysis and radiologist review.',
  },
  {
    id: 'P-10487',
    fileNo: 'NRO-2026-0487',
    firstName: 'Jennifer',
    lastName: 'Brown',
    dateOfBirth: '1988-09-03',
    age: 37,
    gender: 'Female',
    bloodType: 'O-',
    phone: '+1 (555) 432-8765',
    email: 'jennifer.brown@email.com',
    address: '56 Harvard Street',
    city: 'Cambridge, MA 02138',
    emergencyContact: { name: 'Michael Brown', relation: 'Spouse', phone: '+1 (555) 432-8766' },
    height: '5\'7"',
    weight: '138 lbs',
    bmi: 21.6,
    allergies: [],
    chronicConditions: [],
    medications: [],
    primaryPhysician: 'Dr. Emily Park',
    registrationDate: '2026-02-10',
    lastVisit: '2026-02-24',
    status: 'discharged',
    insuranceProvider: 'Cigna',
    insuranceId: 'CGN-334521',
    mriScans: 2,
    diagnosis: 'No tumor detected — Cleared',
    notes: 'Patient cleared after two consecutive negative MRI scans. Discharged from neuro-oncology monitoring.',
  },
  {
    id: 'P-10488',
    fileNo: 'NRO-2026-0488',
    firstName: 'Michael',
    lastName: 'Davis',
    dateOfBirth: '1971-12-25',
    age: 54,
    gender: 'Male',
    bloodType: 'B+',
    phone: '+1 (555) 654-3210',
    email: 'michael.davis@email.com',
    address: '412 Newbury Street',
    city: 'Boston, MA 02116',
    emergencyContact: { name: 'Patricia Davis', relation: 'Spouse', phone: '+1 (555) 654-3211' },
    height: '6\'0"',
    weight: '195 lbs',
    bmi: 26.5,
    allergies: ['Gadolinium'],
    chronicConditions: ['Hypertension', 'Sleep Apnea'],
    medications: ['Amlodipine 5mg', 'Temozolomide 200mg', 'Ondansetron 8mg PRN'],
    primaryPhysician: 'Dr. Sarah Chen',
    registrationDate: '2025-08-03',
    lastVisit: '2026-02-23',
    status: 'referred',
    insuranceProvider: 'Blue Cross Blue Shield',
    insuranceId: 'BCBS-771239',
    mriScans: 7,
    diagnosis: 'Glioblastoma — Right Parietal Lobe',
    notes: 'Referred to MGH Oncology for chemotherapy consultation. Currently on Temozolomide regimen.',
  },
  {
    id: 'P-10489',
    fileNo: 'NRO-2026-0489',
    firstName: 'Susan',
    lastName: 'Martinez',
    dateOfBirth: '1995-04-11',
    age: 30,
    gender: 'Female',
    bloodType: 'A+',
    phone: '+1 (555) 111-2233',
    email: 'susan.martinez@email.com',
    address: '19 Charles River Road',
    city: 'Watertown, MA 02472',
    emergencyContact: { name: 'Rosa Martinez', relation: 'Mother', phone: '+1 (555) 111-2234' },
    height: '5\'5"',
    weight: '130 lbs',
    bmi: 21.6,
    allergies: ['Shellfish'],
    chronicConditions: ['Epilepsy'],
    medications: ['Levetiracetam 500mg'],
    primaryPhysician: 'Dr. Alexander Reid',
    registrationDate: '2026-02-20',
    lastVisit: '2026-02-23',
    status: 'active',
    insuranceProvider: 'Harvard Pilgrim',
    insuranceId: 'HP-998712',
    mriScans: 1,
    diagnosis: 'Pending — Awaiting review',
    notes: 'New patient referral from primary care for seizure evaluation. MRI uploaded, pending analysis.',
  },
];

// ─── Component ───────────────────────────────────────────
const PatientRecords: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'bio' | 'medical' | 'scans' | 'notes'>('bio');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'id'>('name');
  const [patientData, setPatientData] = useState<Patient[]>(patients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [addPatientError, setAddPatientError] = useState('');
  const [newPatientForm, setNewPatientForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female',
    bloodType: 'O+',
    phone: '',
    email: '',
    address: '',
    city: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    height: '',
    weight: '',
    allergies: '',
    chronicConditions: '',
    medications: '',
    primaryPhysician: '',
    insuranceProvider: '',
    insuranceId: '',
    notes: '',
  });

  useEffect(() => {
    patientService.list({ page: 1, pageSize: 100 }).then((data) => {
      setPatientData(data.items.map((p) => ({
        id: p.id, fileNo: p.fileNo, firstName: p.firstName,
        lastName: p.lastName, dateOfBirth: p.dateOfBirth, age: p.age,
        gender: p.gender, bloodType: p.bloodType, phone: p.phone,
        email: p.email, address: p.address, city: p.city,
        emergencyContact: p.emergencyContact, height: p.height, weight: p.weight,
        bmi: p.bmi, allergies: p.allergies, chronicConditions: p.chronicConditions,
        medications: p.medications, primaryPhysician: p.primaryPhysician,
        registrationDate: p.registrationDate, lastVisit: p.lastVisit,
        status: p.status, insuranceProvider: p.insuranceProvider,
        insuranceId: p.insuranceId, mriScans: p.mriScans, diagnosis: p.diagnosis,
        notes: p.notes,
      })));
    }).catch(() => { /* use inline mock fallback */ });
  }, []);

  const filteredPatients = patientData
    .filter((p) => {
      const matchesSearch =
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fileNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.lastName.localeCompare(b.lastName);
      if (sortBy === 'date') return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
      return a.id.localeCompare(b.id);
    });

  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
    discharged: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Discharged' },
    referred: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Referred' },
  };

  const getInitials = (p: Patient) =>
    `${p.firstName[0]}${p.lastName[0]}`;

  const folderColors = [
    'from-amber-100 to-amber-50 border-amber-200',
    'from-blue-50 to-slate-50 border-blue-200',
    'from-emerald-50 to-green-50 border-emerald-200',
    'from-violet-50 to-purple-50 border-violet-200',
    'from-rose-50 to-pink-50 border-rose-200',
    'from-cyan-50 to-sky-50 border-cyan-200',
    'from-orange-50 to-amber-50 border-orange-200',
    'from-teal-50 to-emerald-50 border-teal-200',
  ];

  const resetNewPatientForm = () => {
    setNewPatientForm({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      bloodType: 'O+',
      phone: '',
      email: '',
      address: '',
      city: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      height: '',
      weight: '',
      allergies: '',
      chronicConditions: '',
      medications: '',
      primaryPhysician: '',
      insuranceProvider: '',
      insuranceId: '',
      notes: '',
    });
    setAddPatientError('');
  };

  const closeAddPatientModal = () => {
    setIsAddModalOpen(false);
    resetNewPatientForm();
  };

  const parseListInput = (value: string): string[] =>
    value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

  const getAgeFromDob = (dateOfBirth: string): number => {
    const dob = new Date(dateOfBirth);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age -= 1;
    }
    return Math.max(0, age);
  };

  const handleAddPatientFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewPatientForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddPatientError('');

    if (!newPatientForm.firstName || !newPatientForm.lastName || !newPatientForm.dateOfBirth) {
      setAddPatientError('First name, last name, and date of birth are required.');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const payload = {
      firstName: newPatientForm.firstName.trim(),
      lastName: newPatientForm.lastName.trim(),
      dateOfBirth: newPatientForm.dateOfBirth,
      gender: newPatientForm.gender,
      bloodType: newPatientForm.bloodType.trim() || 'O+',
      phone: newPatientForm.phone.trim() || 'N/A',
      email: newPatientForm.email.trim() || 'N/A',
      address: newPatientForm.address.trim() || 'N/A',
      city: newPatientForm.city.trim() || 'N/A',
      emergencyContact: {
        name: newPatientForm.emergencyName.trim() || 'N/A',
        relation: newPatientForm.emergencyRelation.trim() || 'N/A',
        phone: newPatientForm.emergencyPhone.trim() || 'N/A',
      },
      height: newPatientForm.height.trim() || 'N/A',
      weight: newPatientForm.weight.trim() || 'N/A',
      allergies: parseListInput(newPatientForm.allergies),
      chronicConditions: parseListInput(newPatientForm.chronicConditions),
      medications: parseListInput(newPatientForm.medications),
      primaryPhysician: newPatientForm.primaryPhysician.trim() || 'Unassigned',
      insuranceProvider: newPatientForm.insuranceProvider.trim() || 'N/A',
      insuranceId: newPatientForm.insuranceId.trim() || 'N/A',
    };

    setIsCreatingPatient(true);

    try {
      const created = await patientService.create(payload);
      setPatientData((prev) => [created, ...prev]);
    } catch {
      const fallbackId = `P-${Math.floor(10000 + Math.random() * 90000)}`;
      const fallbackFileNo = `NRO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const fallbackPatient: Patient = {
        id: fallbackId,
        fileNo: fallbackFileNo,
        firstName: payload.firstName,
        lastName: payload.lastName,
        dateOfBirth: payload.dateOfBirth,
        age: getAgeFromDob(payload.dateOfBirth),
        gender: payload.gender,
        bloodType: payload.bloodType,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        city: payload.city,
        emergencyContact: payload.emergencyContact,
        height: payload.height,
        weight: payload.weight,
        bmi: 0,
        allergies: payload.allergies,
        chronicConditions: payload.chronicConditions,
        medications: payload.medications,
        primaryPhysician: payload.primaryPhysician,
        registrationDate: today,
        lastVisit: today,
        status: 'active',
        insuranceProvider: payload.insuranceProvider,
        insuranceId: payload.insuranceId,
        mriScans: 0,
        diagnosis: 'Pending — Awaiting review',
        notes: newPatientForm.notes.trim() || 'New patient record created from dashboard.',
      };

      setPatientData((prev) => [fallbackPatient, ...prev]);
    } finally {
      setIsCreatingPatient(false);
    }

    closeAddPatientModal();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Records</h1>
          <p className="text-gray-500 mt-1">
            Clinical patient files — biodata, medical history, and scan records.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25"
        >
          <HiOutlinePlus className="w-4 h-4" />
          New Patient
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
              placeholder="Search by name, Patient ID, or File No..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineFunnel className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="discharged">Discharged</option>
              <option value="referred">Referred</option>
            </select>
            <div className="flex items-center gap-1 ml-1">
              <HiOutlineBarsArrowUp className="w-4 h-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'id')}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="name">Sort: Name</option>
                <option value="date">Sort: Last Visit</option>
                <option value="id">Sort: Patient ID</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <HiOutlineFolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              <p className="text-xs text-gray-500">Total Records</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <HiOutlineUserGroup className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter((p) => p.status === 'active').length}
              </p>
              <p className="text-xs text-gray-500">Active Patients</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <HiOutlineArrowUpRight className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {patients.filter((p) => p.status === 'referred').length}
              </p>
              <p className="text-xs text-gray-500">Referred</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <LuBrain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {patients.reduce((a, p) => a + p.mriScans, 0)}
              </p>
              <p className="text-xs text-gray-500">Total MRI Scans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Folder Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPatients.map((patient, idx) => {
          const colorClass = folderColors[idx % folderColors.length];
          const sc = statusConfig[patient.status];

          return (
            <button
              key={patient.id}
              onClick={() => {
                setSelectedPatient(patient);
                setActiveTab('bio');
              }}
              className="text-left group"
            >
              {/* Folder Tab */}
              <div className="flex items-end pl-3">
                <div
                  className={`px-4 py-1.5 bg-gradient-to-b ${colorClass} rounded-t-lg border border-b-0 text-xs font-semibold text-gray-600`}
                >
                  {patient.fileNo}
                </div>
              </div>
              {/* Folder Body */}
              <div
                className={`bg-gradient-to-br ${colorClass} rounded-xl rounded-tl-none border p-5 shadow-card group-hover:shadow-elevated group-hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden`}
              >
                {/* Folder lines (decorative) */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-[0.07]">
                  <div className="w-full h-px bg-gray-700 rotate-45 translate-y-4" />
                  <div className="w-full h-px bg-gray-700 rotate-45 translate-y-6" />
                  <div className="w-full h-px bg-gray-700 rotate-45 translate-y-8" />
                </div>

                {/* Patient header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-white/80 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-700">{getInitials(patient)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {patient.lastName}, {patient.firstName}
                    </p>
                    <p className="text-xs text-gray-500">{patient.id}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.text}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Quick info */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendarDays className="w-3 h-3 text-gray-400" />
                    <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-gray-400">•</span>
                    <span>{patient.age}y, {patient.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineSignal className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{patient.diagnosis}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineClock className="w-3 h-3 text-gray-400" />
                    <span>Last visit: {patient.lastVisit}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/5">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <LuBrain className="w-3 h-3" />
                    <span>{patient.mriScans} scan{patient.mriScans !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open File <HiOutlineChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-100 shadow-card">
          <HiOutlineFolder className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No patient records found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* ─── Patient File Detail Modal ──────────────────── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddPatientModal}
        title="Add New Patient"
        maxWidth="xl"
      >
        <form onSubmit={handleCreatePatient} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {addPatientError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
              {addPatientError}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-50/30 rounded-xl p-4 border border-blue-100">
            <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  name="firstName"
                  value={newPatientForm.firstName}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Last Name *</label>
                <input
                  name="lastName"
                  value={newPatientForm.lastName}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={newPatientForm.dateOfBirth}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={newPatientForm.gender}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-50/30 rounded-xl p-4 border border-purple-100">
            <h3 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  name="phone"
                  value={newPatientForm.phone}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPatientForm.email}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="patient@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Address</label>
                <input
                  name="address"
                  value={newPatientForm.address}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="142 Maple Drive"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">City</label>
                <input
                  name="city"
                  value={newPatientForm.city}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="Boston, MA"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Primary Physician</label>
                <input
                  name="primaryPhysician"
                  value={newPatientForm.primaryPhysician}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all"
                  placeholder="Dr. Sarah Chen"
                />
              </div>
            </div>
          </div>

          {/* Physical & Medical Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/30 rounded-xl p-4 border border-emerald-100">
            <h3 className="text-sm font-bold text-emerald-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
              Physical & Medical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Blood Type</label>
                <input
                  name="bloodType"
                  value={newPatientForm.bloodType}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="O+"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Height</label>
                <input
                  name="height"
                  value={newPatientForm.height}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="5 ft 10 in"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Weight</label>
                <input
                  name="weight"
                  value={newPatientForm.weight}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="170 lbs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Allergies</label>
                <input
                  name="allergies"
                  value={newPatientForm.allergies}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="Penicillin, Latex (comma separated)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Chronic Conditions</label>
                <input
                  name="chronicConditions"
                  value={newPatientForm.chronicConditions}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="Hypertension, Diabetes (comma separated)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Medications</label>
                <input
                  name="medications"
                  value={newPatientForm.medications}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all"
                  placeholder="Aspirin 81mg, Metformin 500mg (comma separated)"
                />
              </div>
            </div>
          </div>

          {/* Insurance & Emergency Section */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-50/30 rounded-xl p-4 border border-amber-100">
            <h3 className="text-sm font-bold text-amber-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              Insurance & Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Insurance Provider</label>
                <input
                  name="insuranceProvider"
                  value={newPatientForm.insuranceProvider}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Blue Cross Blue Shield"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Insurance ID</label>
                <input
                  name="insuranceId"
                  value={newPatientForm.insuranceId}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="BCBS-123456"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  name="emergencyName"
                  value={newPatientForm.emergencyName}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Sarah Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Relation</label>
                <input
                  name="emergencyRelation"
                  value={newPatientForm.emergencyRelation}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="Spouse"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Emergency Phone</label>
                <input
                  name="emergencyPhone"
                  value={newPatientForm.emergencyPhone}
                  onChange={handleAddPatientFieldChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
                  placeholder="+1 (555) 222-3333"
                />
              </div>
            </div>
          </div>

          {/* Initial Notes Section */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-50/30 rounded-xl p-4 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-500 rounded-full"></div>
              Initial Clinical Notes
            </h3>
            <textarea
              name="notes"
              rows={3}
              value={newPatientForm.notes}
              onChange={handleAddPatientFieldChange}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 resize-none transition-all"
              placeholder="Add any relevant intake notes or observations..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={closeAddPatientModal}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isCreatingPatient}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors shadow-md shadow-primary-600/30"
              disabled={isCreatingPatient}
            >
              {isCreatingPatient ? 'Creating...' : 'Create Patient'}
            </button>
          </div>
        </form>
      </Modal>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedPatient(null)}
          />

          {/* File Panel */}
          <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-3xl mx-4 animate-slide-up">
            {/* File Tab */}
            <div className="flex items-end pl-6 -mb-px relative z-10">
              <div className="px-5 py-2 bg-amber-50 border border-amber-200 border-b-0 rounded-t-xl text-sm font-semibold text-amber-800">
                📁 {selectedPatient.fileNo}
              </div>
            </div>

            {/* File Container */}
            <div className="border-2 border-amber-200 rounded-xl rounded-tl-none bg-gradient-to-br from-amber-50/50 to-white overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50/30 border-b border-amber-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-amber-200 shadow-sm flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-700">
                        {getInitials(selectedPatient)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 font-mono">{selectedPatient.id}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig[selectedPatient.status].bg} ${statusConfig[selectedPatient.status].text}`}>
                          {statusConfig[selectedPatient.status].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors" title="Print">
                      <HiOutlinePrinter className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors" title="Download">
                      <HiOutlineArrowDownTray className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedPatient(null)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineXMark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-3 border-b border-amber-100 bg-white/40">
                <div className="flex gap-1">
                  {[
                    { key: 'bio', label: 'Biodata', icon: HiOutlineUser },
                    { key: 'medical', label: 'Medical History', icon: HiOutlineHeart },
                    { key: 'scans', label: 'Scan Records', icon: LuBrain },
                    { key: 'notes', label: 'Clinical Notes', icon: HiOutlineDocumentText },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors border-b-2 ${
                        activeTab === tab.key
                          ? 'bg-white text-primary-700 border-primary-500 shadow-sm'
                          : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 bg-white min-h-[380px]">
                {/* ─── BIODATA ─────────────────────────── */}
                {activeTab === 'bio' && (
                  <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Personal Information
                      </h4>
                      {[
                        { icon: HiOutlineUser, label: 'Full Name', value: `${selectedPatient.firstName} ${selectedPatient.lastName}` },
                        { icon: HiOutlineCalendarDays, label: 'Date of Birth', value: `${new Date(selectedPatient.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} (${selectedPatient.age} years)` },
                        { icon: HiOutlineUser, label: 'Gender', value: selectedPatient.gender },
                        { icon: HiOutlineBeaker, label: 'Blood Type', value: selectedPatient.bloodType },
                        { icon: HiOutlineArrowsUpDown, label: 'Height', value: selectedPatient.height },
                        { icon: HiOutlineScale, label: 'Weight', value: selectedPatient.weight },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50">
                          <item.icon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-medium text-gray-900">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Contact & Insurance
                      </h4>
                      {[
                        { icon: HiOutlinePhone, label: 'Phone', value: selectedPatient.phone },
                        { icon: HiOutlineEnvelope, label: 'Email', value: selectedPatient.email },
                        { icon: HiOutlineMapPin, label: 'Address', value: `${selectedPatient.address}, ${selectedPatient.city}` },
                        { icon: HiOutlineShieldCheck, label: 'Insurance', value: `${selectedPatient.insuranceProvider} — ${selectedPatient.insuranceId}` },
                        { icon: HiOutlineCalendarDays, label: 'Registration Date', value: selectedPatient.registrationDate },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50">
                          <item.icon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-400">{item.label}</p>
                            <p className="text-sm font-medium text-gray-900">{item.value}</p>
                          </div>
                        </div>
                      ))}

                      {/* Emergency Contact */}
                      <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100">
                        <div className="flex items-center gap-2 mb-2">
                          <HiOutlineExclamationCircle className="w-4 h-4 text-red-500" />
                          <h5 className="text-xs font-bold text-red-700 uppercase tracking-wider">
                            Emergency Contact
                          </h5>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedPatient.emergencyContact.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {selectedPatient.emergencyContact.relation} •{' '}
                          {selectedPatient.emergencyContact.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── MEDICAL HISTORY ─────────────────── */}
                {activeTab === 'medical' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Physician & BMI */}
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-1">Primary Physician</p>
                          <p className="text-base font-semibold text-gray-900">
                            {selectedPatient.primaryPhysician}
                          </p>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-500 font-semibold mb-1">BMI</p>
                          <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {selectedPatient.bmi}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${
                                selectedPatient.bmi < 18.5
                                  ? 'bg-blue-100 text-blue-700'
                                  : selectedPatient.bmi < 25
                                  ? 'bg-green-100 text-green-700'
                                  : selectedPatient.bmi < 30
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {selectedPatient.bmi < 18.5
                                ? 'Underweight'
                                : selectedPatient.bmi < 25
                                ? 'Normal'
                                : selectedPatient.bmi < 30
                                ? 'Overweight'
                                : 'Obese'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl border border-primary-100">
                        <p className="text-xs text-primary-600 font-semibold mb-2">Current Diagnosis</p>
                        <p className="text-base font-semibold text-gray-900 mb-3">
                          {selectedPatient.diagnosis}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <HiOutlineClock className="w-3 h-3" />
                          Last visit: {selectedPatient.lastVisit}
                        </div>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Allergies
                      </h4>
                      {selectedPatient.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.allergies.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100"
                            >
                              <HiOutlineExclamationCircle className="w-3 h-3" />
                              {a}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No known allergies</p>
                      )}
                    </div>

                    {/* Chronic Conditions */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Chronic Conditions
                      </h4>
                      {selectedPatient.chronicConditions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedPatient.chronicConditions.map((c, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100"
                            >
                              <HiOutlineHeart className="w-3 h-3" />
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No chronic conditions</p>
                      )}
                    </div>

                    {/* Medications */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Current Medications
                      </h4>
                      {selectedPatient.medications.length > 0 ? (
                        <div className="space-y-2">
                          {selectedPatient.medications.map((m, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary-400" />
                              <span className="text-sm text-gray-700 font-medium">{m}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No current medications</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── SCAN RECORDS ────────────────────── */}
                {activeTab === 'scans' && (
                  <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        MRI Scan History
                      </h4>
                      <span className="text-sm font-semibold text-primary-600">
                        {selectedPatient.mriScans} total scan{selectedPatient.mriScans !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {Array.from({ length: selectedPatient.mriScans }, (_, i) => {
                        const scanDate = new Date(selectedPatient.lastVisit);
                        scanDate.setDate(scanDate.getDate() - i * 14);
                        const isLatest = i === 0;
                        return (
                          <div
                            key={i}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                              isLatest
                                ? 'bg-primary-50 border-primary-200'
                                : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isLatest ? 'bg-primary-500 text-white' : 'bg-white text-gray-400 border border-gray-200'
                              }`}
                            >
                              <LuBrain className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                Brain MRI Scan #{selectedPatient.mriScans - i}
                                {isLatest && (
                                  <span className="ml-2 text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                                    LATEST
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {scanDate.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}{' '}
                                • {selectedPatient.primaryPhysician}
                              </p>
                            </div>
                            <button className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors">
                              View
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ─── CLINICAL NOTES ──────────────────── */}
                {activeTab === 'notes' && (
                  <div className="animate-fade-in">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                      Clinical Notes & Observations
                    </h4>
                    <div className="p-5 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-3">
                        <HiOutlineDocumentText className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-semibold text-amber-700">
                          Last updated: {selectedPatient.lastVisit}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-[serif] italic">
                        "{selectedPatient.notes}"
                      </p>
                      <p className="text-xs text-gray-400 mt-4">
                        — {selectedPatient.primaryPhysician}
                      </p>
                    </div>

                    {/* Placeholder for additional notes */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add New Note
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Enter clinical observations..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none transition-all"
                      />
                      <div className="flex justify-end mt-2">
                        <button className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/25">
                          Save Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
